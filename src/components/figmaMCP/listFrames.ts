/**
 * List frames in a Figma file
 * Usage: This script can be used to fetch and list all frames in a Figma file
 */

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
  if (node.type === 'FRAME' || node.type === 'COMPONENT') {
    frames.push({
      id: node.id,
      name: node.name,
      type: node.type,
    });
  }

  if (node.children) {
    node.children.forEach((child) => {
      extractFrames(child, frames);
    });
  }

  return frames;
}

/**
 * List all frames in a Figma file
 * @param fileKey - The Figma file key (from the Figma file URL)
 * @param accessToken - Your Figma personal access token
 * @returns Promise<FrameInfo[]> - Array of frame information
 */
export async function listFrames(
  fileKey: string,
  accessToken: string
): Promise<FrameInfo[]> {
  const url = `https://api.figma.com/v1/files/${fileKey}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    const data: FigmaFileResponse = await response.json();
    const frames = extractFrames(data.document);

    return frames;
  } catch (error) {
    console.error('Error fetching frames from Figma:', error);
    throw error;
  }
}

/**
 * Command-line version (if run directly)
 */
if (require.main === module) {
  const fileKey = process.env.FIGMA_FILE_KEY || process.argv[2];
  const accessToken = process.env.FIGMA_ACCESS_TOKEN || process.argv[3];

  if (!fileKey || !accessToken) {
    console.error('Usage: listFrames <fileKey> <accessToken>');
    console.error('Or set environment variables: FIGMA_FILE_KEY and FIGMA_ACCESS_TOKEN');
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
      console.error('Failed to list frames:', error);
      process.exit(1);
    });
}
