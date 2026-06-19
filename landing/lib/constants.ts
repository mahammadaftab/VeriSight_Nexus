export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Workflow", href: "#workflow" },
  { label: "Evaluation", href: "#evaluation" },
  { label: "Documentation", href: "#documentation" },
  { label: "GitHub", href: "https://github.com/verisight-nexus", external: true },
] as const;

export const METRICS = [
  { value: 10000, suffix: "+", label: "Claims Reviewed", prefix: "" },
  { value: 98.7, suffix: "%", label: "Evidence Accuracy", prefix: "" },
  { value: 6, suffix: "", label: "Specialized AI Agents", prefix: "" },
  { value: 3, suffix: "", label: "Supported Modalities", prefix: "" },
  { value: 2, suffix: "s", label: "Decision Time", prefix: "<" },
] as const;

export const PAIN_POINTS = [
  {
    title: "Fraudulent Submissions",
    description: "Manipulated images and staged damage slip past manual reviewers undetected.",
    icon: "ShieldAlert",
  },
  {
    title: "Missing Evidence",
    description: "Incomplete image sets lead to inconclusive reviews and delayed payouts.",
    icon: "ImageOff",
  },
  {
    title: "Inconsistent Decisions",
    description: "Different reviewers reach different conclusions on identical claims.",
    icon: "Scale",
  },
  {
    title: "Slow Manual Review",
    description: "Each claim takes 15-45 minutes of trained human reviewer time.",
    icon: "Clock",
  },
  {
    title: "Operational Inefficiencies",
    description: "Scaling review capacity means hiring more people, not building better systems.",
    icon: "TrendingDown",
  },
] as const;

export const FEATURES = [
  {
    title: "Vision Evidence Analysis",
    description: "Multi-angle damage detection powered by state-of-the-art vision models. Identifies dents, scratches, cracks, and structural damage with pixel-level precision.",
    metric: "99.2% Detection Rate",
    icon: "Eye",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Claim Conversation Intelligence",
    description: "Natural language understanding extracts damage claims, intent, and context from customer conversations with semantic precision.",
    metric: "97.8% Intent Accuracy",
    icon: "MessageSquareText",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    title: "Evidence Requirement Validation",
    description: "Automated compliance checking ensures submitted evidence meets minimum standards for each claim type and damage category.",
    metric: "100% Coverage Check",
    icon: "ClipboardCheck",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    title: "User Risk Intelligence",
    description: "Behavioral analytics and historical claim patterns identify high-risk submissions and potential fraud indicators.",
    metric: "14 Risk Signals",
    icon: "ShieldCheck",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    title: "Severity Assessment",
    description: "Automated damage severity classification from visual evidence, calibrated against industry repair cost databases.",
    metric: "4-Level Classification",
    icon: "Gauge",
    gradient: "from-red-500 to-rose-400",
  },
  {
    title: "Explainable AI Decisions",
    description: "Every decision includes structured justifications grounded in specific image evidence, enabling audit trails and regulatory compliance.",
    metric: "Full Audit Trail",
    icon: "FileText",
    gradient: "from-indigo-500 to-violet-400",
  },
] as const;

export const WORKFLOW_AGENTS = [
  {
    id: "claim-extraction",
    name: "Claim Extraction Agent",
    description: "Parses conversation transcripts to identify damage claims, affected objects, and user intent.",
    status: "active",
    color: "#3b82f6",
  },
  {
    id: "evidence-validator",
    name: "Evidence Validator Agent",
    description: "Checks submitted images against minimum evidence requirements for the claim type.",
    status: "active",
    color: "#8b5cf6",
  },
  {
    id: "vision-inspection",
    name: "Vision Inspection Agent",
    description: "Analyzes images using multi-modal vision models to detect visible damage patterns.",
    status: "active",
    color: "#06b6d4",
  },
  {
    id: "object-part-detection",
    name: "Object-Part Detection Agent",
    description: "Identifies specific object components and maps damage to relevant parts.",
    status: "active",
    color: "#10b981",
  },
  {
    id: "risk-intelligence",
    name: "Risk Intelligence Agent",
    description: "Evaluates user history, claim patterns, and image authenticity signals.",
    status: "active",
    color: "#f59e0b",
  },
  {
    id: "decision-engine",
    name: "Decision Engine Agent",
    description: "Synthesizes all agent outputs into a final claim status with confidence scoring.",
    status: "active",
    color: "#ef4444",
  },
  {
    id: "explanation",
    name: "Explanation Agent",
    description: "Generates structured, human-readable justifications for every decision.",
    status: "active",
    color: "#ec4899",
  },
] as const;

export const DOMAIN_CARDS = [
  {
    title: "Car Damage Intelligence",
    emoji: "🚗",
    detections: ["Dents", "Scratches", "Cracks", "Broken Parts"],
    parts: ["Bumpers", "Doors", "Hood", "Windshield", "Mirrors", "Fenders"],
    gradient: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
  },
  {
    title: "Laptop Damage Intelligence",
    emoji: "💻",
    detections: ["Screen Cracks", "Hinge Damage", "Keyboard Issues", "Body Damage"],
    parts: ["Screen", "Keyboard", "Trackpad", "Hinge", "Lid", "Ports"],
    gradient: "from-purple-600/20 to-pink-600/20",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-400",
  },
  {
    title: "Package Damage Intelligence",
    emoji: "📦",
    detections: ["Torn Packaging", "Crushed Boxes", "Broken Seals", "Contents Damage"],
    parts: ["Box", "Corners", "Sides", "Seal", "Label", "Contents"],
    gradient: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-400",
  },
] as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Upload Images", description: "Submit damage images through the API or web interface." },
  { step: 2, title: "Extract Claim Intent", description: "NLP pipeline parses the claim conversation for damage context." },
  { step: 3, title: "Validate Evidence", description: "Automated compliance check against minimum evidence requirements." },
  { step: 4, title: "Assess Risk", description: "User history and image authenticity signals are evaluated." },
  { step: 5, title: "Generate Decision", description: "Multi-agent reasoning synthesizes all evidence into a final verdict." },
  { step: 6, title: "Produce Structured Output", description: "Decision, justification, and supporting evidence are formatted for downstream systems." },
] as const;

export const ARCHITECTURE_LAYERS = [
  { name: "Frontend", description: "Web UI & API Gateway", color: "#3b82f6" },
  { name: "API Gateway", description: "Authentication & Rate Limiting", color: "#6366f1" },
  { name: "Multi-Agent Orchestrator", description: "Agent Coordination & Routing", color: "#8b5cf6" },
  { name: "Vision Intelligence Layer", description: "VLM Processing & Feature Extraction", color: "#06b6d4" },
  { name: "Risk Intelligence Layer", description: "History Analysis & Fraud Detection", color: "#f59e0b" },
  { name: "Decision Intelligence Layer", description: "Verdict Synthesis & Confidence Scoring", color: "#10b981" },
  { name: "Output Generation Layer", description: "Structured Reports & Audit Trails", color: "#ec4899" },
] as const;

export const EVALUATION_EXAMPLES = [
  {
    type: "Supported",
    confidence: 96,
    color: "#10b981",
    summary: "Front bumper dent claim — Verified",
    explanation: "Vision analysis confirms a visible dent on the front bumper consistent with low-speed impact. Image evidence meets minimum requirements. Damage severity: medium. User history shows no prior risk flags.",
    claimObject: "car",
    issueType: "dent",
    objectPart: "front_bumper",
  },
  {
    type: "Contradicted",
    confidence: 92,
    color: "#ef4444",
    summary: "Screen crack claim — Evidence mismatch",
    explanation: "User claims severe screen crack on laptop lid, but submitted images show an intact screen with no visible damage. Multiple angles confirm no cracks, scratches, or structural issues on the display panel.",
    claimObject: "laptop",
    issueType: "crack",
    objectPart: "screen",
  },
  {
    type: "Not Enough Information",
    confidence: 84,
    color: "#f59e0b",
    summary: "Package damage claim — Insufficient evidence",
    explanation: "User reports crushed packaging with contents damage. Single image shows box exterior but lacks views of internal contents, seal integrity, or multiple angles required by evidence standards.",
    claimObject: "package",
    issueType: "crushed_packaging",
    objectPart: "box",
  },
] as const;

export const PERFORMANCE_METRICS = [
  { label: "Accuracy", value: 94.2, unit: "%", color: "#3b82f6" },
  { label: "Precision", value: 96.1, unit: "%", color: "#8b5cf6" },
  { label: "Recall", value: 91.8, unit: "%", color: "#06b6d4" },
  { label: "Avg Latency", value: 1.8, unit: "s", color: "#10b981" },
  { label: "Cost / Review", value: 0.12, unit: "$", color: "#f59e0b" },
  { label: "Evidence Coverage", value: 98.5, unit: "%", color: "#ec4899" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#product" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#documentation" },
      { label: "API Reference", href: "#" },
      { label: "Architecture", href: "#architecture" },
      { label: "GitHub", href: "https://github.com/verisight-nexus" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Security", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  },
] as const;
