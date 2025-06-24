import type { Route } from "./+types/home";
import { Demo } from "../demo/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Video Carousel" },
    { name: "description", content: "Video carousel" },
  ];
}

export default function Home() {
  return <Demo />;
}
