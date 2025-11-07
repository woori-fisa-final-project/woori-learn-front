interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaFileResponse {
  document: FigmaNode;
  name: string;
}

interface FrameInfo {
  id: string;
  name: string;
  type: string;
}

/**
 * Recursively extract frames from Figma document tree
 */
function extractFrames(node: FigmaNode, frames: FrameInfo[] = []): FrameInfo[] {
  if (node.type === "FRAME" || node.type === "COMPONENT") {
    frames.push({
      id: node.id,
      name: node.name,
      type: node.type,
    });
  }

  if (node.children) {
    node.children.forEach((child) => extractFrames(child, frames));
  }

  return frames;
}

/**
 * Fetch and list all frames from a Figma file
 */
export async function listFrames(
  fileKey: string,
  accessToken: string
): Promise<FrameInfo[]> {
  const url = `https://api.figma.com/v1/files/${fileKey}`;

  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": accessToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.statusText}`);
  }

  const data: FigmaFileResponse = await response.json();
  return extractFrames(data.document);
}

// Command-line interface
if (require.main === module) {
  const fileKey = process.env.FIGMA_FILE_KEY || process.argv[2];
  const accessToken = process.env.FIGMA_ACCESS_TOKEN || process.argv[3];

  if (!fileKey || !accessToken) {
    console.error(
      "Usage: tsx listFrames.ts <file-key> <access-token>\n" +
        "Or set FIGMA_FILE_KEY and FIGMA_ACCESS_TOKEN environment variables"
    );
    process.exit(1);
  }

  listFrames(fileKey, accessToken)
    .then((frames) => {
      console.log(`\nFound ${frames.length} frame(s):\n`);
      frames.forEach((frame, index) => {
        console.log(`${index + 1}. ${frame.name} (${frame.type})`);
        console.log(`   ID: ${frame.id}\n`);
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
      process.exit(1);
    });
}

