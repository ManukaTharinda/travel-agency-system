
"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Maximize,
  Crop,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Loader2,
} from "lucide-react";

type LogoEditorProps = {
  image: string;
  onCancel: () => void;
  onSave: (file: File) => void;
};

type CropPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type EditorMode = "fit" | "fill";

const OUTPUT_SIZE = 1000;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function getRotatedSize(
  width: number,
  height: number,
  rotation: number
) {
  const radians = (rotation * Math.PI) / 180;

  return {
    width:
      Math.abs(Math.cos(radians) * width) +
      Math.abs(Math.sin(radians) * height),
    height:
      Math.abs(Math.sin(radians) * width) +
      Math.abs(Math.cos(radians) * height),
  };
}

async function createLogoFile(
  imageUrl: string,
  crop: CropPixels,
  rotation: number,
  mode: EditorMode,
  background: string
): Promise<File> {
  const image = await createImage(imageUrl);

  const rotatedSize = getRotatedSize(
    image.naturalWidth,
    image.naturalHeight,
    rotation
  );

  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = Math.ceil(rotatedSize.width);
  rotatedCanvas.height = Math.ceil(rotatedSize.height);

  const rotatedContext = rotatedCanvas.getContext("2d");

  if (!rotatedContext) {
    throw new Error("Unable to process image.");
  }

  rotatedContext.translate(
    rotatedCanvas.width / 2,
    rotatedCanvas.height / 2
  );

  rotatedContext.rotate((rotation * Math.PI) / 180);

  rotatedContext.drawImage(
    image,
    -image.naturalWidth / 2,
    -image.naturalHeight / 2
  );

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = OUTPUT_SIZE;
  outputCanvas.height = OUTPUT_SIZE;

  const outputContext = outputCanvas.getContext("2d");

  if (!outputContext) {
    throw new Error("Unable to create logo.");
  }

  if (background !== "transparent") {
    outputContext.fillStyle = background;
    outputContext.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  }

  if (mode === "fit") {
    const scale = Math.min(
      OUTPUT_SIZE / rotatedCanvas.width,
      OUTPUT_SIZE / rotatedCanvas.height
    );

    const width = rotatedCanvas.width * scale;
    const height = rotatedCanvas.height * scale;

    outputContext.drawImage(
      rotatedCanvas,
      (OUTPUT_SIZE - width) / 2,
      (OUTPUT_SIZE - height) / 2,
      width,
      height
    );
  } else {
    outputContext.drawImage(
      rotatedCanvas,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    outputCanvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Unable to generate PNG."));
        }
      },
      "image/png"
    );
  });

  return new File([blob], "agency-logo.png", {
    type: "image/png",
  });
}

export function LogoEditor({
  image,
  onCancel,
  onSave,
}: LogoEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mode, setMode] = useState<EditorMode>("fit");
  const [background, setBackground] = useState("transparent");
  const [customColor, setCustomColor] = useState("#E2E8F0");

  const [cropPixels, setCropPixels] = useState<CropPixels>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CropPixels) => {
      setCropPixels(croppedAreaPixels);
    },
    []
  );

  async function handleSave() {
    setProcessing(true);
    setError("");

    try {
      const file = await createLogoFile(
        image,
        cropPixels,
        rotation,
        mode,
        background
      );

      onSave(file);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process logo."
      );

      setProcessing(false);
    }
  }

  const backgroundOptions = [
    { label: "Transparent", value: "transparent" },
    { label: "White", value: "#FFFFFF" },
    { label: "Black", value: "#000000" },
  ];

  return (
    <div className="
      fixed inset-0 z-50 flex items-center justify-center
      overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md
      sm:p-6
    ">
      <div className="
        my-auto w-full max-w-3xl overflow-hidden rounded-3xl
        border border-white/20 bg-white/95
        shadow-2xl shadow-black/30
        dark:border-white/10 dark:bg-slate-900/95
      ">

        {/* Header */}
        <div className="
          flex items-center justify-between
          border-b border-slate-200/80
          bg-white/70 px-5 py-5
          dark:border-white/[0.08] dark:bg-slate-900/70
          sm:px-7
        ">
          <div className="flex items-center gap-3">
            <div className="
              flex h-11 w-11 items-center justify-center
              rounded-xl bg-blue-50 text-blue-600
              dark:bg-blue-500/10 dark:text-blue-400
            ">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Edit Agency Logo
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Customize your logo before uploading.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            aria-label="Close logo editor"
            className="
              rounded-xl p-2.5 text-slate-500
              transition hover:bg-slate-100 hover:text-slate-900
              disabled:cursor-not-allowed disabled:opacity-50
              dark:text-slate-400 dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">

          {/* Image Workspace */}
          <div className="min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Image Workspace
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Drag to reposition your logo.
                </p>
              </div>

              <span className="
                rounded-full border border-blue-100
                bg-blue-50 px-3 py-1 text-[10px]
                font-semibold uppercase tracking-wider text-blue-700
                dark:border-blue-400/20 dark:bg-blue-500/10
                dark:text-blue-400
              ">
                1:1 Ratio
              </span>
            </div>

            <div className="
              relative mx-auto aspect-square w-full
              max-w-[420px] overflow-hidden rounded-2xl
              border border-slate-200
              bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)]
              bg-[length:20px_20px]
              bg-[position:0_0,0_10px,10px_-10px,-10px_0px]
              dark:border-white/10
              dark:bg-slate-800
            ">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                objectFit={mode === "fit" ? "contain" : "cover"}
                cropShape="rect"
                showGrid
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Preview your logo before saving.
            </p>
          </div>

          {/* Editing Controls */}
          <div className="space-y-6">

            {/* Mode */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Display Mode
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Choose how your logo fits.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => setMode("fit")}
                  className={`
                    flex items-center gap-2 rounded-xl border p-3
                    text-left text-xs font-medium transition-all
                    ${
                      mode === "fit"
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <Maximize className="h-4 w-4 shrink-0" />
                  Fit Entire Logo
                </button>

                <button
                  type="button"
                  onClick={() => setMode("fill")}
                  className={`
                    flex items-center gap-2 rounded-xl border p-3
                    text-left text-xs font-medium transition-all
                    ${
                      mode === "fill"
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <Crop className="h-4 w-4 shrink-0" />
                  Fill Square
                </button>
              </div>
            </div>

            {/* Zoom */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Zoom
                </label>

                <span className="
                  rounded-lg bg-slate-100 px-2 py-1
                  text-xs font-semibold text-slate-600
                  dark:bg-white/10 dark:text-slate-300
                ">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ZoomOut className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(event) =>
                    setZoom(Number(event.target.value))
                  }
                  className="w-full cursor-pointer accent-blue-600"
                />

                <ZoomIn className="h-4 w-4 shrink-0 text-slate-400" />
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Rotation
              </label>

              <button
                type="button"
                onClick={() =>
                  setRotation((previous) => (previous + 90) % 360)
                }
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl border border-slate-200
                  bg-white px-4 py-3 text-sm font-medium
                  text-slate-700 transition hover:bg-slate-50
                  dark:border-white/10 dark:bg-white/[0.03]
                  dark:text-slate-300 dark:hover:bg-white/[0.08]
                "
              >
                <RotateCw className="h-4 w-4" />
                Rotate 90°
              </button>
            </div>

            {/* Background */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Background
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Choose your logo background.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {backgroundOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setBackground(item.value)}
                    className={`
                      rounded-lg border px-3 py-2 text-xs
                      font-medium transition
                      ${
                        background === item.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Colour */}
              <div className="
                flex items-center justify-between gap-3
                rounded-xl border border-slate-200
                bg-slate-50/70 p-3
                dark:border-white/10 dark:bg-white/[0.03]
              ">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-slate-500" />

                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Custom colour
                  </span>
                </div>

                <input
                  type="color"
                  value={customColor}
                  onChange={(event) => {
                    setCustomColor(event.target.value);
                    setBackground(event.target.value);
                  }}
                  aria-label="Choose custom logo background"
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output Information */}
        <div className="px-5 pb-5 sm:px-7">
          <div className="
            flex items-center gap-3 rounded-xl
            border border-blue-100 bg-blue-50/70
            px-4 py-3
            dark:border-blue-400/15 dark:bg-blue-500/[0.07]
          ">
            <ImageIcon className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

            <div>
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                Export Format: PNG
              </p>

              <p className="mt-0.5 text-xs text-blue-700/80 dark:text-blue-400/80">
                Square image · 1000 × 1000 pixels
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="
          flex flex-col-reverse gap-3
          border-t border-slate-200/80
          bg-slate-50/70 px-5 py-5
          dark:border-white/[0.08] dark:bg-slate-950/40
          sm:flex-row sm:justify-end sm:px-7
        ">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="
              rounded-xl border border-slate-200
              bg-white px-5 py-3 text-sm font-medium
              text-slate-700 transition hover:bg-slate-100
              disabled:cursor-not-allowed disabled:opacity-50
              dark:border-white/10 dark:bg-white/[0.03]
              dark:text-slate-300 dark:hover:bg-white/[0.08]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={processing}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-blue-600 px-6 py-3
              text-sm font-semibold text-white
              shadow-sm shadow-blue-600/20
              transition-all hover:-translate-y-0.5
              hover:bg-blue-700 hover:shadow-md
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Use This Logo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
