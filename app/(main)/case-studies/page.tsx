import { redirect } from "next/navigation";

// Case studies are accessed directly from cards on home page
// No listing page needed
export default function CaseStudiesPage() {
  redirect("/");
}
