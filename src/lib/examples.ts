import { Language } from "./url-state";

export const EXAMPLES: Record<Language, { name: string; content: string }[]> = {
  latex: [
    {
      name: "Pythagorean",
      content: `c = \\sqrt{a^2 + b^2}`
    },
    {
      name: "Maxwell",
      content: `\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0\\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)
\\end{aligned}`
    },
    {
        name: "Matrix",
        content: `A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}`
    }
  ],
  mermaid: [
    {
      name: "Flowchart",
      content: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]`
    },
    {
      name: "Sequence",
      content: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`
    },
    {
      name: "Gantt",
      content: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d`
    }
  ],
  markdown: [
    {
      name: "Hello World",
      content: `# Hello World

This is a **markdown** example.

- List item 1
- List item 2

\`\`\`javascript
console.log('Hello');
\`\`\``
    },
    {
      name: "Table",
      content: `| Name | Age | Role |
|------|-----|------|
| Alice| 24  | Dev  |
| Bob  | 30  | Lead |`
    }
  ],
  code: [
    {
      name: "React Component",
      content: `function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
}`
    },
    {
      name: "API Route",
      content: `export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(\`https://api.example.com/data/\${id}\`)
  const data = await res.json()
 
  return Response.json({ data })
}`
    }
  ]
};
