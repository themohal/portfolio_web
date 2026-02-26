"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AboutStat {
  label: string;
  value: string;
}

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Hero
  const [heroTitle, setHeroTitle] = useState("Muhammad Farjad Ali Raza");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Full-Stack Developer \u00b7 Creative Technologist \u00b7 Problem Solver"
  );

  // About
  const [aboutPhoto, setAboutPhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [aboutText, setAboutText] = useState<string[]>([
    "I'm a passionate full-stack developer with a love for building beautiful, performant web applications. With expertise spanning modern frontend frameworks and robust backend systems, I bring ideas to life through clean code and thoughtful design.",
    "When I'm not coding, you can find me exploring new technologies, contributing to open source, or writing about software development on my blog.",
  ]);
  const [aboutStats, setAboutStats] = useState<AboutStat[]>([
    { label: "Years Exp.", value: "3+" },
    { label: "Projects", value: "20+" },
    { label: "Technologies", value: "10+" },
  ]);

  // Social
  const [socialGithub, setSocialGithub] = useState("https://github.com");
  const [socialLinkedin, setSocialLinkedin] = useState("https://linkedin.com");
  const [socialTwitter, setSocialTwitter] = useState("https://twitter.com");

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*");

      if (data) {
        for (const setting of data) {
          const val = setting.value;
          switch (setting.key) {
            case "hero_title":
              if (typeof val === "string") setHeroTitle(val);
              break;
            case "hero_subtitle":
              if (typeof val === "string") setHeroSubtitle(val);
              break;
            case "about_photo":
              if (typeof val === "string") setAboutPhoto(val);
              break;
            case "about_text":
              if (Array.isArray(val)) setAboutText(val);
              break;
            case "about_stats":
              if (Array.isArray(val)) setAboutStats(val);
              break;
            case "social_github":
              if (typeof val === "string") setSocialGithub(val);
              break;
            case "social_linkedin":
              if (typeof val === "string") setSocialLinkedin(val);
              break;
            case "social_twitter":
              if (typeof val === "string") setSocialTwitter(val);
              break;
          }
        }
      }

      setLoading(false);
    }

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upsertSetting(key: string, value: unknown) {
    await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await Promise.all([
        upsertSetting("hero_title", heroTitle),
        upsertSetting("hero_subtitle", heroSubtitle),
        upsertSetting("about_photo", aboutPhoto),
        upsertSetting("about_text", aboutText),
        upsertSetting("about_stats", aboutStats),
        upsertSetting("social_github", socialGithub),
        upsertSetting("social_linkedin", socialLinkedin),
        upsertSetting("social_twitter", socialTwitter),
      ]);
      setMessage("Settings saved successfully!");
    } catch {
      setMessage("Failed to save settings.");
    }

    setSaving(false);
  }

  function updateAboutParagraph(index: number, text: string) {
    const updated = [...aboutText];
    updated[index] = text;
    setAboutText(updated);
  }

  function addAboutParagraph() {
    setAboutText([...aboutText, ""]);
  }

  function removeAboutParagraph(index: number) {
    if (aboutText.length <= 1) return;
    setAboutText(aboutText.filter((_, i) => i !== index));
  }

  function updateStat(index: number, field: "label" | "value", text: string) {
    const updated = [...aboutStats];
    updated[index] = { ...updated[index], [field]: text };
    setAboutStats(updated);
  }

  function addStat() {
    setAboutStats([...aboutStats, { label: "", value: "" }]);
  }

  function removeStat(index: number) {
    if (aboutStats.length <= 1) return;
    setAboutStats(aboutStats.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-white mb-8">Site Settings</h2>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Hero Section */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
            Hero Section
          </h3>
          <div className="space-y-4">
            <Input
              id="heroTitle"
              label="Name / Title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
            <Input
              id="heroSubtitle"
              label="Subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </div>
        </section>

        {/* About Section */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
            About Section
          </h3>

          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {aboutPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aboutPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">&#x1F468;&#x200D;&#x1F4BB;</span>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingPhoto}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingPhoto(true);
                    const fileExt = file.name.split(".").pop();
                    const fileName = `profile-${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                      .from("project-images")
                      .upload(fileName, file);
                    if (uploadError) {
                      setMessage("Failed to upload photo: " + uploadError.message);
                      setUploadingPhoto(false);
                      return;
                    }
                    const { data: urlData } = supabase.storage
                      .from("project-images")
                      .getPublicUrl(fileName);
                    setAboutPhoto(urlData.publicUrl);
                    setUploadingPhoto(false);
                  }}
                  className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer cursor-pointer"
                />
                {uploadingPhoto && <p className="text-sm text-gray-400">Uploading...</p>}
                {aboutPhoto && (
                  <button
                    type="button"
                    onClick={() => setAboutPhoto("")}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Paragraphs</label>
            {aboutText.map((text, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={text}
                  onChange={(e) => updateAboutParagraph(i, e.target.value)}
                  rows={3}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={`Paragraph ${i + 1}`}
                />
                {aboutText.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAboutParagraph(i)}
                    className="self-start px-2 py-2.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAboutParagraph}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              + Add paragraph
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-gray-300">Stats</label>
            {aboutStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="Value (e.g. 3+)"
                  className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Label (e.g. Years Exp.)"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {aboutStats.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStat}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              + Add stat
            </button>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
            Social Links
          </h3>
          <div className="space-y-4">
            <Input
              id="socialGithub"
              label="GitHub URL"
              value={socialGithub}
              onChange={(e) => setSocialGithub(e.target.value)}
              placeholder="https://github.com/username"
            />
            <Input
              id="socialLinkedin"
              label="LinkedIn URL"
              value={socialLinkedin}
              onChange={(e) => setSocialLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
            <Input
              id="socialTwitter"
              label="Twitter URL"
              value={socialTwitter}
              onChange={(e) => setSocialTwitter(e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
        </section>

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
