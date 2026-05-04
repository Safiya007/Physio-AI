import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  RotateCcw,
} from "lucide-react";

type PostureStatus = "good" | "warning" | "bad" | "idle";

interface JointAngle {
  name: string;
  angle: number;
  ideal: number;
  tolerance: number;
  status: PostureStatus;
}

interface Keypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

const exercises: Record<string, { label: string; joints: { name: string; ideal: number; tolerance: number }[] }> = {
  standing: {
    label: "Standing Posture",
    joints: [
      { name: "Shoulder Alignment", ideal: 180, tolerance: 15 },
      { name: "Hip Alignment", ideal: 175, tolerance: 10 },
      { name: "Knee Extension", ideal: 178, tolerance: 12 },
    ],
  },
  armRaise: {
    label: "Arm Raise (Shoulder)",
    joints: [
      { name: "Arm Elevation", ideal: 170, tolerance: 20 },
      { name: "Torso Straightness", ideal: 180, tolerance: 10 },
      { name: "Elbow Extension", ideal: 175, tolerance: 15 },
    ],
  },
  squat: {
    label: "Squat (Knee/Hip)",
    joints: [
      { name: "Knee Angle", ideal: 90, tolerance: 20 },
      { name: "Hip Hinge", ideal: 80, tolerance: 15 },
      { name: "Back Angle", ideal: 160, tolerance: 15 },
    ],
  },
};

const statusConfig = {
  good: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Great Form!" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Adjust Slightly" },
  bad: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Needs Correction" },
  idle: { icon: Eye, color: "text-muted-foreground", bg: "bg-muted", label: "Waiting..." },
};

const getAngle = (a: Keypoint, b: Keypoint, c: Keypoint): number => {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
};

const PostureTracker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const detectorRef = useRef<any>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("standing");
  const [jointAngles, setJointAngles] = useState<JointAngle[]>([]);
  const [overallStatus, setOverallStatus] = useState<PostureStatus>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("Start your camera to begin posture analysis");
  const [modelLoaded, setModelLoaded] = useState(false);

  const exerciseConfig = exercises[selectedExercise];

  const loadPoseModel = useCallback(async () => {
    if (detectorRef.current) return;
    setLoading(true);
    try {
      // Dynamically import TensorFlow.js and pose detection
      const tf = await import("@tensorflow/tfjs-core");
      await import("@tensorflow/tfjs-backend-webgl");
      await tf.setBackend("webgl");
      await tf.ready();
      const poseDetection = await import("@tensorflow-models/pose-detection");
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );
      detectorRef.current = detector;
      setModelLoaded(true);
    } catch (err) {
      console.error("Failed to load pose model:", err);
      setFeedbackMsg("Could not load pose detection model. Please try again.");
    }
    setLoading(false);
  }, []);

  const startCamera = async () => {
    setLoading(true);
    try {
      await loadPoseModel();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setFeedbackMsg("Stand in full view of the camera. Analyzing your posture...");
    } catch (err) {
      console.error("Camera error:", err);
      setFeedbackMsg("Could not access camera. Please allow camera permissions.");
    }
    setLoading(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraOn(false);
    setOverallStatus("idle");
    setJointAngles([]);
    setFeedbackMsg("Camera stopped. Start again to resume tracking.");
  };

  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current || !cameraOn) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const poses = await detectorRef.current.estimatePoses(video);

      // Draw video frame
      ctx.drawImage(video, 0, 0);

      if (poses.length > 0 && poses[0].keypoints) {
        const kps: Keypoint[] = poses[0].keypoints;
        const byName: Record<string, Keypoint> = {};
        kps.forEach((kp: Keypoint) => {
          byName[kp.name] = kp;
        });

        // Draw skeleton
        drawSkeleton(ctx, kps);

        // Calculate angles based on exercise
        const angles: JointAngle[] = exerciseConfig.joints.map((joint) => {
          let angle = 0;

          if (joint.name.includes("Shoulder") || joint.name.includes("Arm")) {
            const shoulder = byName["left_shoulder"] || byName["right_shoulder"];
            const elbow = byName["left_elbow"] || byName["right_elbow"];
            const hip = byName["left_hip"] || byName["right_hip"];
            if (shoulder && elbow && hip && shoulder.score > 0.3 && elbow.score > 0.3) {
              angle = getAngle(hip, shoulder, elbow);
            }
          } else if (joint.name.includes("Knee")) {
            const hip = byName["left_hip"] || byName["right_hip"];
            const knee = byName["left_knee"] || byName["right_knee"];
            const ankle = byName["left_ankle"] || byName["right_ankle"];
            if (hip && knee && ankle && knee.score > 0.3) {
              angle = getAngle(hip, knee, ankle);
            }
          } else if (joint.name.includes("Hip") || joint.name.includes("Back") || joint.name.includes("Torso")) {
            const shoulder = byName["left_shoulder"] || byName["right_shoulder"];
            const hip = byName["left_hip"] || byName["right_hip"];
            const knee = byName["left_knee"] || byName["right_knee"];
            if (shoulder && hip && knee && hip.score > 0.3) {
              angle = getAngle(shoulder, hip, knee);
            }
          } else if (joint.name.includes("Elbow")) {
            const shoulder = byName["left_shoulder"] || byName["right_shoulder"];
            const elbow = byName["left_elbow"] || byName["right_elbow"];
            const wrist = byName["left_wrist"] || byName["right_wrist"];
            if (shoulder && elbow && wrist && elbow.score > 0.3) {
              angle = getAngle(shoulder, elbow, wrist);
            }
          }

          const diff = Math.abs(angle - joint.ideal);
          let status: PostureStatus = "good";
          if (diff > joint.tolerance * 2) status = "bad";
          else if (diff > joint.tolerance) status = "warning";

          return { name: joint.name, angle: Math.round(angle), ideal: joint.ideal, tolerance: joint.tolerance, status };
        });

        setJointAngles(angles);

        // Overall status
        const badCount = angles.filter((a) => a.status === "bad").length;
        const warnCount = angles.filter((a) => a.status === "warning").length;
        let overall: PostureStatus = "good";
        if (badCount > 0) overall = "bad";
        else if (warnCount > 0) overall = "warning";
        setOverallStatus(overall);

        // Feedback message
        if (overall === "good") {
          setFeedbackMsg("Excellent posture! Keep holding this position. 💪");
        } else if (overall === "warning") {
          const adj = angles.find((a) => a.status === "warning");
          setFeedbackMsg(`Almost there! Adjust your ${adj?.name.toLowerCase()} slightly.`);
        } else {
          const bad = angles.find((a) => a.status === "bad");
          setFeedbackMsg(`⚠️ Correct your ${bad?.name.toLowerCase()} — current: ${bad?.angle}°, target: ${bad?.ideal}°`);
        }
      } else {
        setFeedbackMsg("Move into full view of the camera so I can see your body.");
        setOverallStatus("idle");
      }
    } catch {
      // silently retry
    }

    animFrameRef.current = requestAnimationFrame(analyzeFrame);
  }, [cameraOn, exerciseConfig]);

  const drawSkeleton = (ctx: CanvasRenderingContext2D, kps: Keypoint[]) => {
    const connections = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];

    const byName: Record<string, Keypoint> = {};
    kps.forEach((kp) => (byName[kp.name] = kp));

    // Draw connections
    ctx.strokeStyle = "hsl(174, 72%, 40%)";
    ctx.lineWidth = 3;
    connections.forEach(([a, b]) => {
      const pa = byName[a];
      const pb = byName[b];
      if (pa && pb && pa.score > 0.3 && pb.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    });

    // Draw keypoints
    kps.forEach((kp) => {
      if (kp.score > 0.3) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = kp.score > 0.6 ? "hsl(174, 72%, 40%)" : "hsl(38, 92%, 50%)";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (cameraOn && modelLoaded) {
      analyzeFrame();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [cameraOn, modelLoaded, analyzeFrame]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const StatusIcon = statusConfig[overallStatus].icon;

  return (
    <section id="posture" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Camera className="h-3 w-3 mr-1" /> Posture Tracking
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Real-Time Posture Correction
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Use your webcam to track body positions and get instant AI feedback on your exercise form.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Exercise selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(exercises).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedExercise(key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  selectedExercise === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-card-foreground border border-border hover:bg-accent"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Camera view */}
            <div className="lg:col-span-3">
              <div className="relative bg-foreground rounded-2xl overflow-hidden shadow-card aspect-[4/3]">
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted style={{ display: cameraOn ? "none" : "none" }} />
                <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-cover ${cameraOn ? "" : "hidden"}`} />

                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <Camera className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-primary-foreground/60 text-sm max-w-xs text-center">
                      Enable your camera to start real-time posture tracking and form correction
                    </p>
                  </div>
                )}

                {/* Status overlay */}
                {cameraOn && (
                  <div className={`absolute top-4 left-4 ${statusConfig[overallStatus].bg} rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig[overallStatus].color}`} />
                    <span className={`text-sm font-medium ${statusConfig[overallStatus].color}`}>
                      {statusConfig[overallStatus].label}
                    </span>
                  </div>
                )}

                {/* Exercise label */}
                {cameraOn && (
                  <div className="absolute top-4 right-4 bg-foreground/60 text-primary-foreground text-xs px-3 py-1.5 rounded-full">
                    {exerciseConfig.label}
                  </div>
                )}
              </div>

              {/* Camera controls */}
              <div className="flex gap-3 mt-4 justify-center">
                {!cameraOn ? (
                  <Button onClick={startCamera} variant="hero" className="rounded-full px-8" disabled={loading}>
                    {loading ? (
                      <>Loading AI Model...</>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" /> Start Camera
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="destructive" className="rounded-full px-6">
                      <CameraOff className="h-4 w-4 mr-2" /> Stop Camera
                    </Button>
                    <Button
                      onClick={() => {
                        setJointAngles([]);
                        setOverallStatus("idle");
                        setFeedbackMsg("Position reset. Hold your pose...");
                      }}
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Analysis panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Feedback */}
              <div className={`${statusConfig[overallStatus].bg} rounded-xl border border-border p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon className={`h-5 w-5 ${statusConfig[overallStatus].color}`} />
                  <h3 className="font-heading font-semibold text-card-foreground">Live Feedback</h3>
                </div>
                <p className="text-sm text-card-foreground/80 leading-relaxed">{feedbackMsg}</p>
              </div>

              {/* Joint angles */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold text-card-foreground mb-4">Joint Analysis</h3>
                <div className="space-y-4">
                  {(jointAngles.length > 0 ? jointAngles : exerciseConfig.joints.map((j) => ({
                    name: j.name,
                    angle: 0,
                    ideal: j.ideal,
                    tolerance: j.tolerance,
                    status: "idle" as PostureStatus,
                  }))).map((joint) => {
                    const JIcon = statusConfig[joint.status].icon;
                    const progress = joint.angle > 0 ? Math.min(100, (1 - Math.abs(joint.angle - joint.ideal) / (joint.tolerance * 3)) * 100) : 0;
                    return (
                      <div key={joint.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <JIcon className={`h-3.5 w-3.5 ${statusConfig[joint.status].color}`} />
                            <span className="text-sm font-medium text-card-foreground">{joint.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {joint.angle > 0 ? `${joint.angle}°` : "—"} / {joint.ideal}°
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              joint.status === "good"
                                ? "bg-success"
                                : joint.status === "warning"
                                ? "bg-warning"
                                : joint.status === "bad"
                                ? "bg-destructive"
                                : "bg-muted-foreground/20"
                            }`}
                            style={{ width: `${Math.max(progress, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold text-card-foreground mb-3">Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Stand 5-8 feet from camera for best detection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Ensure good lighting and wear fitted clothes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Keep your full body in frame
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostureTracker;
