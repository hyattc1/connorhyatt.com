"use client";

import data from "@/data/socials.json";
import { socialSchema } from "@/lib/schemas";
import Icon from "./Icon";
import { toast } from "sonner";

export default function Socials() {
  const socials = socialSchema.parse(data).socials;

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("connorhyatt1@gmail.com");
      toast.success("Email copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy email:', err);
      toast.error("Failed to copy email");
    }
  };

  // Filter out email from socials to render separately
  const otherSocials = socials.filter(item => item.name !== "Email");

  return (
    <section className="flex gap-6">
      {/* Render other social icons first */}
      {otherSocials.map((item) => (
        <a
          href={item.href}
          key={item.name}
          target="_blank"
          className="text-muted-foreground hover:text-foreground"
          rel="noopener noreferrer"
          title={item.name}
        >
          <span className="sr-only">{item.name}</span>
          <Icon name={item.icon} aria-hidden="true" className="size-5" />
        </a>
      ))}
      
      {/* Render email icon separately */}
      <span
        onClick={handleEmailClick}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        title="Click to copy email"
      >
        <span className="sr-only">Email</span>
        <Icon name="mail" aria-hidden="true" className="size-5" />
      </span>
    </section>
  );
}
