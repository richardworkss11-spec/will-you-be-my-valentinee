"use client";

import { useState, useCallback } from "react";
import type { Screen, FormData } from "@/lib/types";

const initialFormData: FormData = {
  name: "",
  instagram: "",
  date: "",
  reason: "",
  photo: null,
  message: "",
  location: "",
  song: "",
};

export function useScreenState(initialScreen: Screen = "landing") {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const goTo = useCallback((s: Screen) => setScreen(s), []);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { screen, goTo, formData, updateField };
}
