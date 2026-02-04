import { readFile } from "fs/promises";
import { join } from "path";
import CaseStudyPage from "./client-page";

async function getCaseStudyData(slug: string) {
  try {
    const filePath = join(process.cwd(), "content", "case-studies", `${slug}.mdx`);
    const fileContent = await readFile(filePath, "utf-8");
    
    // Parse frontmatter - split by --- delimiter
    const lines = fileContent.split(/\r?\n/);
    
    if (!lines[0].includes("---")) {
      throw new Error("Invalid MDX format: missing opening ---");
    }
    
    // Find the closing --- line
    let closingIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        closingIndex = i;
        break;
      }
    }
    
    if (closingIndex === -1) {
      throw new Error("Invalid MDX format: missing closing ---");
    }
    
    // Extract frontmatter and body
    const frontmatterLines = lines.slice(1, closingIndex);
    const bodyLines = lines.slice(closingIndex + 1);
    const body = bodyLines.join("\n").trim();
    
    const frontmatter: Record<string, any> = {};
    
    // Parse YAML frontmatter
    let currentKey = "";
    let currentArray: string[] = [];
    let isInArray = false;
    
    frontmatterLines.forEach((line) => {
      const trimmed = line.trim();
      
      if (!trimmed) return;
      
      // Check if line is an array item
      if (trimmed.startsWith("- ")) {
        if (!isInArray) {
          isInArray = true;
          currentArray = [];
        }
        currentArray.push(trimmed.substring(2).replace(/["']/g, ""));
      } else if (trimmed.includes(":")) {
        // If we were collecting array items, save them
        if (isInArray && currentKey) {
          frontmatter[currentKey] = currentArray;
          isInArray = false;
          currentArray = [];
        }
        
        const [key, ...valueParts] = trimmed.split(":");
        currentKey = key.trim();
        let value: any = valueParts.join(":").trim();
        
        // Parse value
        if (value.toLowerCase() === "true") {
          value = true;
        } else if (value.toLowerCase() === "false") {
          value = false;
        } else {
          value = value.replace(/^["']|["']$/g, "");
        }
        
        frontmatter[currentKey] = value;
      }
    });
    
    // Save any remaining array
    if (isInArray && currentKey) {
      frontmatter[currentKey] = currentArray;
    }
    
    return {
      query: "",
      variables: { relativePath: `${slug}.mdx` },
      data: {
        caseStudy: {
          ...frontmatter,
          body,
          _sys: {
            filename: slug,
            basename: slug,
          },
        },
      },
    };
  } catch (error) {
    console.error(`Error loading case study: ${slug}`, error);
    throw error;
  }
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCaseStudyData(params.slug);
  return <CaseStudyPage {...data} />;
}

// Generate static paths for all case studies
export async function generateStaticParams() {
  try {
    const fs = await import("fs/promises");
    const dirPath = join(process.cwd(), "content", "case-studies");
    const files = await fs.readdir(dirPath);
    
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => ({
        slug: file.replace(".mdx", ""),
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
