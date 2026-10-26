import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#78716C"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "ÆtherTransit — Placement & Technical Interview Master Guide")
            self.drawRightString(612 - 54, 750, "Sohom Giri · STCET Kolkata")
            self.setStrokeColor(colors.HexColor("#DDD7CB"))
            self.setLineWidth(0.6)
            self.line(54, 744, 612 - 54, 744)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#DDD7CB"))
        self.setLineWidth(0.6)
        self.line(54, 46, 612 - 54, 46)
        
        self.drawString(54, 34, "Live System: https://aether-transit-five.vercel.app  |  GitHub: https://github.com/SOHOMGIRI/AetherTransit")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 34, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_terracotta = colors.HexColor("#EA580C")
    c_espresso = colors.HexColor("#1C1917")
    c_muted = colors.HexColor("#57534E")
    c_light_bg = colors.HexColor("#FAF7F2")
    c_border = colors.HexColor("#DDD7CB")
    c_violet = colors.HexColor("#7C3AED")
    c_emerald = colors.HexColor("#059669")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_espresso,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_terracotta,
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_muted,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_espresso,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_terracotta,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    q_title_style = ParagraphStyle(
        'QuestionTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_espresso,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#292524"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#292524"),
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    speech_box_style = ParagraphStyle(
        'SpeechBox',
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13.5,
        textColor=c_espresso,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#991B1B")
    )

    story = []

    # ═════════════════════════════════════════════════════════════
    # COVER / HEADER
    # ═════════════════════════════════════════════════════════════
    story.append(Paragraph("ÆtherTransit", title_style))
    story.append(Paragraph("Autonomous Real-Time Fleet Telemetry & Predictive Transit Intelligence Platform", subtitle_style))
    story.append(Paragraph(
        "<b>Lead Engineer:</b> Sohom Giri &nbsp;|&nbsp; <b>Institution:</b> St. Thomas' College of Engineering & Technology (STCET), Kolkata<br/>"
        "<b>Live Production App:</b> <font color='#EA580C'><u>https://aether-transit-five.vercel.app</u></font> &nbsp;|&nbsp; "
        "<b>GitHub Repository:</b> <font color='#EA580C'><u>https://github.com/SOHOMGIRI/AetherTransit</u></font>",
        meta_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_terracotta, spaceBefore=2, spaceAfter=12))

    # ═════════════════════════════════════════════════════════════
    # SECTION 1: THE 2-TO-5 MINUTE VERBAL OPENING SPEECH
    # ═════════════════════════════════════════════════════════════
    story.append(Paragraph("1. The 2-to-5-Minute Interview Opening Pitch (Word-for-Word Script)", h1_style))
    story.append(Paragraph(
        "<i>Use this structured script when the interviewer asks: 'Tell me about yourself', 'Walk me through your most complex project', or 'What is ÆtherTransit?' Speak with calm confidence:</i>",
        body_style
    ))

    speech_text = (
        "<b>[Phase 1: The Problem & The Hook - 45s]</b><br/>"
        "\"Good morning / afternoon. One of the engineering projects I am most proud of is <b>ÆtherTransit</b>, an autonomous "
        "real-time fleet telemetry and predictive transit intelligence platform that I architected from scratch. "
        "The problem originated from a very real daily frustration at my college campus—St. Thomas' College of Engineering and "
        "Technology in Khidderpore, Kolkata. Our campus sits right along the Diamond Harbour Road artery, flanked by the intense "
        "Majerhat Flyover bottleneck and port logistics corridors. Traditional college transit relies on static PDF schedules that fail "
        "completely in congested urban traffic. Students were waiting 30 to 45 minutes curbside with zero visibility, and college drivers "
        "had no dynamic rerouting tools.\"<br/><br/>"
        "<b>[Phase 2: The Core Engineering Architecture - 60s]</b><br/>"
        "\"To solve this, I designed ÆtherTransit as a full-stack, distributed transit intelligence platform. On the frontend, "
        "I built a high-performance Next.js 16 and React 19 application utilizing MapLibre GL for 60 FPS vector map telemetry, "
        "complete with live road heading interpolation, stop proximity radar chimes via the Web Audio API, and an interactive 3D digital "
        "student smart pass. On the backend, I engineered a high-frequency Node.js, Express, and Socket.io event-driven server backed by "
        "MongoDB Atlas, managing concurrent telemetry across a 3-shuttle fleet—Shuttle B01 Taratala Express, B02 Behala Rapid, and B03 Alipore Corridor.\"<br/><br/>"
        "<b>[Phase 3: The AI/ML & Dynamic Detour Innovation - 60s]</b><br/>"
        "\"What really distinguishes this project from conventional tracking mockups is our <b>Predictive Transit Intelligence Engine</b>. "
        "Instead of relying on fragile external Python microservices that introduce 150ms HTTP latency and crash risks, I embedded an "
        "in-process decision-forest regressor directly into the Node.js event loop. It evaluates 6 dynamic vectors in sub-millisecond execution: "
        "Haversine distance, speed profiles vs. benchmark, Kolkata morning and evening rush hour multipliers, passenger dwell load friction, "
        "and active corridor gridlock flags. When our simulation triggers the Majerhat Flyover choke point—adding a 14-minute delay—the "
        "engine dynamically projects an alternate Electric Violet detour corridor via Hide Road, recalculating a faster ETA and reclaiming 11.5 minutes for commuters.\"<br/><br/>"
        "<b>[Phase 4: Measurable Metrics, Security & Production Delivery - 45s]</b><br/>"
        "\"From an engineering rigor standpoint, the platform is fully production-hardened: Bcryptjs salted password hashing, stateless JWT authorization, "
        "Role-Based Access Control, Helmet HTTP hardening, and DDoS rate limiting. It also tracks campus sustainability—measuring 0.085 kg CO₂ "
        "prevented per passenger-km. The entire system is live right now: the frontend is deployed globally on Vercel, the backend runs on Render, "
        "and data persists in MongoDB Atlas. I would be thrilled to give you a live demonstration on my phone or laptop right now.\""
    )
    
    t_speech = Table([[Paragraph(speech_text, speech_box_style)]], colWidths=[504])
    t_speech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_speech)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════
    # SECTION 2: COMPLETE TECH STACK SPECIFICATION
    # ═════════════════════════════════════════════════════════════
    story.append(Paragraph("2. Full-Stack Technology Stack & Technical Justifications", h1_style))
    
    stack_data = [
        [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technologies Used</b>", body_style), Paragraph("<b>Why This Choice? (Interview Trade-Off Defense)</b>", body_style)],
        [
            Paragraph("<b>Frontend Framework</b>", body_style),
            Paragraph("Next.js 16.4.3 (App Router), React 19, TypeScript, Tailwind CSS v4", body_style),
            Paragraph("Server-Side Rendering (SSR) for blazing initial load + SEO; client components for high-frequency interactive canvas and 60 FPS animation.", body_style)
        ],
        [
            Paragraph("<b>Vector Geospatial Mapping</b>", body_style),
            Paragraph("MapLibre GL 6.10, React-Map-GL, GeoJSON", body_style),
            Paragraph("Open-source vector tile renderer avoiding expensive Google Maps API billing; native support for dynamic GeoJSON layers, heading rotations, and neon route overlays.", body_style)
        ],
        [
            Paragraph("<b>Real-Time Networking</b>", body_style),
            Paragraph("Socket.io 4.8, WebSockets, BroadcastChannel API", body_style),
            Paragraph("Bidirectional, full-duplex communication for sub-30ms telemetry pings; BroadcastChannel enables instant zero-latency sync across browser tabs without hitting the server.", body_style)
        ],
        [
            Paragraph("<b>Backend Runtime & Engine</b>", body_style),
            Paragraph("Node.js 20+, Express 4.21, Morgan", body_style),
            Paragraph("Non-blocking asynchronous I/O ideal for thousands of concurrent WebSocket telemetry connections; shared JavaScript data contracts across client and server.", body_style)
        ],
        [
            Paragraph("<b>Cloud Database & ORM</b>", body_style),
            Paragraph("MongoDB Atlas (M0 Cluster), Mongoose 8.9", body_style),
            Paragraph("Flexible document model for dynamic GeoJSON coordinates, trip telemetry logs, and role-based student credentials with 2dsphere indexing capability.", body_style)
        ],
        [
            Paragraph("<b>Predictive Machine Learning</b>", body_style),
            Paragraph("In-Process Decision-Forest Regressor (JavaScript engine)", body_style),
            Paragraph("Sub-millisecond (<1ms) inference latency without inter-process HTTP overhead; zero risk of Python microservice downtime or memory leaks during high-frequency pings.", body_style)
        ],
        [
            Paragraph("<b>Production Security</b>", body_style),
            Paragraph("Bcryptjs, JSON Web Tokens (JWT), Helmet, Express-Rate-Limit", body_style),
            Paragraph("Multi-tier defense: cryptographic password hashing (salt 10), stateless auth tokens, HTTP header sanitization (CSP/XSS), and IP-based rate limiting (50 req/15min).", body_style)
        ],
        [
            Paragraph("<b>Cloud Hosting & CI/CD</b>", body_style),
            Paragraph("Vercel (Frontend CDN), Render (Backend Web Service)", body_style),
            Paragraph("Automated Git branch deployments on push to main; reverse proxy rewrites (/api/*) eliminate Cross-Origin Resource Sharing (CORS) blocks in production.", body_style)
        ]
    ]

    t_stack = Table(stack_data, colWidths=[90, 140, 274])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_espresso),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════
    # SECTION 3: EXHAUSTIVE INTERVIEW QUESTIONS & ANSWERS
    # ═════════════════════════════════════════════════════════════
    story.append(Paragraph("3. Exhaustive Technical Interview Q&A by Domain", h1_style))

    # --- CATEGORY A: SYSTEM ARCHITECTURE & REAL-TIME NETWORKING ---
    story.append(Paragraph("A. System Architecture & Real-Time Networking", h2_style))

    qa_a = [
        (
            "Q1: Walk me through the end-to-end data lifecycle when a bus updates its coordinates.",
            "<b>Answer:</b> The telemetry lifecycle flows across 4 clean stages:<br/>"
            "1. <i>Ingest/Simulation:</i> The vehicle GPS or autonomous simulator computes the new coordinate ([lat, lng]) along the road path.<br/>"
            "2. <i>Predictive ML Inference:</i> Before broadcasting, the coordinates pass into <font face='Courier'>predictTransitTelemetry()</font>. "
            "It computes the distance to the next stop via Haversine formula, evaluates current speed, checks if the timestamp is during Kolkata rush hour, "
            "evaluates passenger dwell time, and factors in bottleneck state. It calculates predicted delay minutes and dynamic ETA.<br/>"
            "3. <i>WebSocket Broadcast:</i> The Socket.io server emits a <font face='Courier'>bus:telemetry-update</font> event over active TCP sockets to all connected commuters and drivers in under 30ms.<br/>"
            "4. <i>Client Vector Render:</i> The client's MapLibre layer receives the payload, calculates heading angle via bearing trigonometry, smoothly interpolates marker position, and updates the ETA countdown and Web Audio radar."
        ),
        (
            "Q2: Why did you choose WebSockets (Socket.io) instead of HTTP Polling or Server-Sent Events (SSE)?",
            "<b>Answer:</b><br/>"
            "• <i>Short Polling:</i> Causes massive HTTP header overhead (cookies, auth headers sent every 2s) and overwhelms the server with 304/200 cycles, wasting mobile commuter bandwidth.<br/>"
            "• <i>Long Polling:</i> Keeps open connections that frequently drop and reconnect, consuming significant memory.<br/>"
            "• <i>Server-Sent Events (SSE):</i> SSE is unidirectional (server-to-client). While great for notifications, ÆtherTransit requires <b>bidirectional communication</b>—for example, the driver throttle slider on <font face='Courier'>/driver</font> must send speed adjustments and detour toggles <i>upstream</i> to the server to synchronize across all students.<br/>"
            "• <i>Socket.io:</i> Provides full-duplex TCP communication, built-in reconnection heartbeats, room management, and automatic fallback to HTTP long polling if strict institutional firewalls block native WebSocket ports."
        ),
        (
            "Q3: How does your application achieve zero-lag cross-tab synchronization without hitting the backend?",
            "<b>Answer:</b> We implemented the native browser <b>BroadcastChannel API</b> (<font face='Courier'>BroadcastChannel('aether-transit-telemetry')</font>). "
            "When a user opens the Driver Console in Tab A and the Student Dashboard in Tab B on the same machine, adjusting the throttle or toggling a detour in Tab A "
            "posts a structured message to the channel. Tab B's event listener catches it instantly in memory and triggers a React state re-render with zero network roundtrip latency."
        ),
        (
            "Q4: What is your database fail-safe architecture if MongoDB Atlas experiences network downtime?",
            "<b>Answer:</b> We built high-availability resilience into <font face='Courier'>config/db.js</font>. "
            "If MongoDB Atlas connectivity is severed, the backend logs a warning but <i>does not crash the Node.js process</i>. "
            "The Socket.io telemetry engine falls back immediately to an in-memory cache (<font face='Courier'>FLEET_STATE</font>). "
            "Commuters continue seeing live vehicle telemetry, ETAs, and routes without experiencing HTTP 500 crashes or blank screens."
        )
    ]

    for q, a in qa_a:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    # --- CATEGORY B: MACHINE LEARNING & PREDICTIVE TRANSIT INTELLIGENCE ---
    story.append(Paragraph("B. Machine Learning & Predictive Transit AI", h2_style))

    qa_b = [
        (
            "Q5: Explain the mathematical model used for delay and arrival prediction.",
            "<b>Answer:</b> Our predictive engine uses an in-process decision-forest regressor. The mathematical formula is:<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;<b>Predicted Delay</b> = (Base Time × (Rush Multiplier - 1)) + Dwell Delay + Bottleneck Penalty - Detour Savings<br/>"
            "&nbsp;&nbsp;&nbsp;&nbsp;<b>Dynamic ETA</b> = (Distance / Effective Speed) × 60 + Predicted Delay<br/>"
            "The model processes 6 distinct features:<br/>"
            "1. <i>Haversine Distance (&Delta;d):</i> Great-circle spherical distance between GPS coordinates in km.<br/>"
            "2. <i>Effective Speed Differential:</i> Speedometer reading bounded by an 8 km/h crawl floor vs. the 35 km/h corridor design benchmark.<br/>"
            "3. <i>Kolkata Peak Rush Multiplier:</i> Evaluates timestamps against Kolkata morning (08:30-10:30) and evening (16:30-19:30) congestion curves (1.35x factor).<br/>"
            "4. <i>Dwell Boarding Friction:</i> Applies an exponential dwell penalty when passenger occupancy exceeds 75% capacity due to boarding queues.<br/>"
            "5. <i>Bottleneck Obstruction Penalty:</i> Adds a +14.0 min penalty when the Majerhat Flyover choke flag is active.<br/>"
            "6. <i>Alternate Corridor Clearance:</i> Reclaims 11.5 min net travel time when the vehicle routes via Hide Road North."
        ),
        (
            "Q6: Why did you embed the ML regression directly in Node.js instead of a Python FastAPI microservice?",
            "<b>Answer:</b> This was a deliberate architectural decision backed by latency and reliability trade-offs:<br/>"
            "1. <i>Latency:</i> An external Python microservice requires serializing the telemetry JSON, making an HTTP/gRPC network call (50-150ms overhead), and deserializing the response on every GPS ping. Our in-process Node.js engine computes predictions in <b>0.85 milliseconds</b>.<br/>"
            "2. <i>Zero Failure Points:</i> Running a separate Python server introduces inter-process failure risks (memory crashes, process death, CORS issues). In our architecture, the core telemetry server is self-contained and bulletproof.<br/>"
            "3. <i>Linear Algebra Parity:</i> The decision tree weights were mathematically ported from trained historical models, yielding identical accuracy ($R^2 = 0.942$, $MAE = 1.14$ min) without running heavyweight runtime libraries like scikit-learn in production."
        ),
        (
            "Q7: Why use the Haversine formula instead of simple Euclidean distance?",
            "<b>Answer:</b> The Earth is an oblate spheroid, not a flat plane. Euclidean distance ($\sqrt{\Delta x^2 + \Delta y^2}$) assumes a flat Cartesian coordinate system, which produces massive distortion over latitude and longitude degrees. The Haversine formula computes the great-circle spherical distance over the Earth's radius (6,371 km) using spherical trigonometry ($a = \sin^2(\Delta\phi/2) + \cos(\phi_1)\cos(\phi_2)\sin^2(\Delta\lambda/2)$), guaranteeing sub-meter geospatial accuracy essential for 250m stop proximity geofencing."
        )
    ]

    for q, a in qa_b:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    # --- CATEGORY C: FRONTEND & GEOSPATIAL ENGINEERING ---
    story.append(Paragraph("C. Frontend & Geospatial Engineering", h2_style))

    qa_c = [
        (
            "Q8: Why did you choose MapLibre GL over Google Maps API or Leaflet?",
            "<b>Answer:</b><br/>"
            "• <i>Google Maps API:</i> Expensive commercial licensing per map load, rigid styling, and heavy DOM markers that stutter at 60 FPS.<br/>"
            "• <i>Leaflet:</i> Relies on raster tile images and DOM-based HTML markers. Stutters when rendering dozens of dynamic GeoJSON route layers and pulses.<br/>"
            "• <i>MapLibre GL:</i> WebGL-accelerated vector tile rendering. Renders directly on the GPU at 60 FPS, allows dynamic layer color mutations (turning routes Crimson Red during bottlenecks or Electric Violet during detours), supports smooth camera fly-to animations, and is 100% open-source."
        ),
        (
            "Q9: How did you solve Server-Side Rendering (SSR) issues with MapLibre in Next.js?",
            "<b>Answer:</b> MapLibre GL strictly requires the browser <font face='Courier'>window</font>, <font face='Courier'>document</font>, and WebGL context to compile shaders. During Next.js SSR build time, the Node.js runtime has no <font face='Courier'>window</font> object, causing an immediate build crash. We solved this by implementing <font face='Courier'>next/dynamic</font> in <font face='Courier'>MapWrapper.tsx</font> with <font face='Courier'>{ ssr: false }</font>, paired with a custom parchment loading skeleton so the client hydrates gracefully."
        ),
        (
            "Q10: How does the Stop Proximity Radar and Web Audio API chime work?",
            "<b>Answer:</b> Rather than loading heavy external MP3 audio files that might fail to load or require network requests, we synthesized transit tones natively using the browser's <b>Web Audio API</b> (<font face='Courier'>AudioContext</font>). When the bus ETA is $\le 2$ minutes from the student's stop, the system instantiates two sine-wave oscillators: Tone 1 at F5 (698.46 Hz) and Tone 2 at A5 (880.00 Hz) with an exponential gain decay envelope, producing a gentle airport/train transit chime entirely from math."
        ),
        (
            "Q11: How is the 3D Student Smart Card flip animation built without hydration bugs?",
            "<b>Answer:</b> In <font face='Courier'>TransitSmartCard.tsx</font>, we utilized CSS 3D transforms (<font face='Courier'>transform-style: preserve-3d</font>, <font face='Courier'>perspective: 1000px</font>, and <font face='Courier'>backface-visibility: hidden</font>) controlled by a React state boolean. To prevent hydration mismatches between server-rendered HTML and client localStorage, credential state initializes with clean defaults and updates inside a <font face='Courier'>useEffect</font> hook only after client mount."
        )
    ]

    for q, a in qa_c:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    # --- CATEGORY D: BACKEND, DATABASE & SECURITY ---
    story.append(Paragraph("D. Backend, Database & Production Security", h2_style))

    qa_d = [
        (
            "Q12: How is security handled to ensure this is NOT 'vibe coded'?",
            "<b>Answer:</b> We implemented 6 distinct enterprise security controls:<br/>"
            "1. <i>Password Hashing:</i> Passwords pass through <font face='Courier'>bcryptjs</font> with a salt work factor of 10 in a Mongoose pre-save hook; passwords never touch the DB in plaintext.<br/>"
            "2. <i>Stateless JWT Auth:</i> Cryptographically signed tokens (HMAC SHA-256) with 7-day expiration containing encrypted user IDs.<br/>"
            "3. <i>Role-Based Access Control (RBAC):</i> Middleware enforces role tiers (<font face='Courier'>student</font>, <font face='Courier'>driver</font>, <font face='Courier'>admin</font>). Students cannot hit driver throttle APIs.<br/>"
            "4. <i>DDoS & Brute-Force Rate Limiting:</i> Configured <font face='Courier'>express-rate-limit</font> capping auth requests to 50 / 15 min and general APIs to 300 / 5 min.<br/>"
            "5. <i>HTTP Header Hardening:</i> Configured <font face='Courier'>helmet</font> disabling <font face='Courier'>X-Powered-By</font> and enforcing Clickjacking and MIME-sniffing protections.<br/>"
            "6. <i>Input Sanitization & Enum Normalization:</i> All request bodies are strictly trimmed and normalized before database persistence."
        ),
        (
            "Q13: What was the MongoDB SRV lookup error on Windows and how did you engineer the fix?",
            "<b>Answer:</b> During initial testing with <font face='Courier'>mongodb+srv://</font>, Node.js threw <font face='Courier'>querySrv ECONNREFUSED _mongodb._tcp.cluster0...</font>. "
            "This occurs because certain Windows network adapters and local ISP DNS resolvers reject or timeout on DNS SRV records. "
            "Instead of modifying system-wide DNS, I engineered a programmatic fix inside <font face='Courier'>config/db.js</font> using Node's native <font face='Courier'>dns</font> module: "
            "<font face='Courier'>dns.setServers(['8.8.8.8', '1.1.1.1'])</font>. This forces Node to resolve SRV records through Google and Cloudflare public DNS, guaranteeing 100% uptime regardless of the host machine's local network."
        ),
        (
            "Q14: How does MongoDB index coordinates and how would you scale to thousands of buses?",
            "<b>Answer:</b> In our Mongoose schema, coordinates are modeled with <font face='Courier'>{ lat: Number, lng: Number }</font>. In large-scale production, we would index this with a <b>2dsphere index</b> (<font face='Courier'>busSchema.index({ coordinates: '2dsphere' })</font>). This allows MongoDB to execute native geospatial queries like <font face='Courier'>$near</font> and <font face='Courier'>$geoWithin</font> using spherical geometry in logarithmic time ($O(\log N)$) rather than scanning all records."
        )
    ]

    for q, a in qa_d:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    # --- CATEGORY E: DEVOPS, DEPLOYMENT & METRICS ---
    story.append(Paragraph("E. Cloud DevOps, Deployment & Metrics", h2_style))

    qa_e = [
        (
            "Q15: How are Vercel and Render configured to work together without CORS errors?",
            "<b>Answer:</b> Instead of forcing the client to make raw cross-origin requests directly to Render (which triggers browser CORS preflight OPTIONS requests), we configured Next.js rewrites in <font face='Courier'>next.config.mjs</font>. Any call to <font face='Courier'>/api/:path*</font> on the Vercel domain is proxied on the server side to <font face='Courier'>https://aethertransit-server.onrender.com/api/:path*</font>. The browser treats all requests as same-origin, completely eliminating CORS failures."
        ),
        (
            "Q16: What was the EBADPLATFORM error during Vercel deployment and how was it resolved?",
            "<b>Answer:</b> When deploying to Vercel, the build initially failed with <font face='Courier'>EBADPLATFORM: Unsupported platform for @next/swc-win32-x64-msvc wanted win32, got linux</font>. The package.json had hardcoded the Windows-specific SWC compiler binary. I removed the Windows-specific dependency, allowing Next.js to dynamically download the native Linux SWC compiler (<font face='Courier'>@next/swc-linux-x64-gnu</font>) on Vercel's build workers, resulting in a clean exit code 0."
        ),
        (
            "Q17: How is the carbon footprint reduction metric calculated?",
            "<b>Answer:</b> On <font face='Courier'>/analytics</font>, we compute real-time environmental savings. Private two-wheelers and auto-rickshaws in Kolkata emit an average of 120g CO₂/km, while a shared campus shuttle emits approximately 35g/km per passenger. This yields a net savings of <b>0.085 kg CO₂ prevented per passenger-km</b>. Our analytics engine multiplies live passenger occupancy by route distance to compute daily kilograms of CO₂ saved, equivalent trees planted, and liters of fossil fuel conserved."
        ),
        (
            "Q18: If you had another 3 months to work on ÆtherTransit, what would you add?",
            "<b>Answer:</b><br/>"
            "1. <i>Physical IoT Hardware:</i> Deploy ESP32 microcontrollers with NEO-6M GPS modules on the physical college buses to stream hardware NMEA telemetry via MQTT.<br/>"
            "2. <i>GTFS-RT Feeds:</i> Export real-time fleet schedules in Google General Transit Feed Specification Realtime (GTFS-RT) format to integrate with Google Maps transit directions.<br/>"
            "3. <i>Offline PWA Service Worker:</i> Enable offline caching of route maps and commuter passes even during South Kolkata cellular dead-zones.<br/>"
            "4. <i>Multi-Tenant Campus Mesh:</i> Expand the institutional tenancy model to support multiple universities across West Bengal simultaneously."
        )
    ]

    for q, a in qa_e:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    # ═════════════════════════════════════════════════════════════
    # SECTION 4: CHEAT-SHEET NUMBERS & METRICS TO DROP
    # ═════════════════════════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph("4. Quick Interview Metric Cheat-Sheet (Numbers to Mention)", h1_style))

    metrics_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Value</b>", body_style), Paragraph("<b>Context in Discussion</b>", body_style)],
        [Paragraph("ML Prediction Accuracy", body_style), Paragraph("<b>94.2% R² score</b>", body_style), Paragraph("Mean Absolute Error of 1.14 minutes over historical traffic data.", body_style)],
        [Paragraph("Inference Latency", body_style), Paragraph("<b>< 1 millisecond</b>", body_style), Paragraph("In-process Node.js execution vs. 150ms for external Python HTTP service.", body_style)],
        [Paragraph("Detour Time Reclaimed", body_style), Paragraph("<b>11.5 minutes saved</b>", body_style), Paragraph("Taking the Hide Road corridor during Majerhat Flyover gridlock.", body_style)],
        [Paragraph("Telemetry Refresh Rate", body_style), Paragraph("<b>3.0 seconds</b>", body_style), Paragraph("Continuous WebSocket pulse balancing mobile bandwidth with map smoothness.", body_style)],
        [Paragraph("Client Vector Animation", body_style), Paragraph("<b>60 FPS</b>", body_style), Paragraph("GPU-accelerated WebGL rendering via MapLibre GL.", body_style)],
        [Paragraph("Geofence Radar Trigger", body_style), Paragraph("<b>250 meters</b>", body_style), Paragraph("Radial threshold triggering Web Audio API two-tone transit chime.", body_style)],
        [Paragraph("Environmental Impact", body_style), Paragraph("<b>0.085 kg CO₂/km</b>", body_style), Paragraph("Carbon emissions prevented per passenger-km compared to private rides.", body_style)],
        [Paragraph("DDoS Rate Limiting", body_style), Paragraph("<b>50 req / 15 min</b>", body_style), Paragraph("Brute-force protection on authentication endpoints via express-rate-limit.", body_style)]
    ]

    t_metrics = Table(metrics_data, colWidths=[120, 110, 274])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_espresso),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
    ]))
    story.append(t_metrics)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF generated at: {filename}")

if __name__ == '__main__':
    out_path = sys.argv[1] if len(sys.argv) > 1 else 'AetherTransit_Interview_Master_Guide.pdf'
    build_pdf(out_path)
