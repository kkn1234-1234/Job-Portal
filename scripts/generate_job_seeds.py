import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

PASSWORD_HASH = "$2a$10$Dow1tK0N6D2PfYZ7RUTpuOZ4A3TBUnIF.rLnbryuVKC7jHimoMuqu"

# Counts for generated seed data
APPLICANT_COUNT = 30
EMPLOYER_COUNT = 10
JOB_COUNT = 80
APPLICATION_COUNT = 120

it_roles = [
    {
        "title": "Software Engineer",
        "summary": "Build and maintain scalable web applications.",
        "requirements": "Proficiency in modern web stack; knowledge of Git workflows.",
        "responsibilities": "Collaborate with cross-functional teams to implement features.",
        "skills": "JavaScript; React; REST APIs",
        "industry": "Information Technology"
    },
    {
        "title": "Backend Developer",
        "summary": "Design resilient backend services and APIs.",
        "requirements": "Experience with microservices; database fundamentals.",
        "responsibilities": "Implement REST endpoints and ensure high availability.",
        "skills": "Java; Spring Boot; SQL",
        "industry": "Information Technology"
    },
    {
        "title": "Frontend Developer",
        "summary": "Deliver rich, accessible user interfaces.",
        "requirements": "Strong React or Angular skills; CSS mastery.",
        "responsibilities": "Translate design wireframes into responsive pages.",
        "skills": "React; TypeScript; Tailwind CSS",
        "industry": "Information Technology"
    },
    {
        "title": "Full Stack Developer",
        "summary": "Own features end-to-end across web stack.",
        "requirements": "Solid MERN stack proficiency; REST best practices.",
        "responsibilities": "Design, develop, and deploy features across front and back end.",
        "skills": "Node.js; React; MongoDB",
        "industry": "Information Technology"
    },
    {
        "title": "DevOps Engineer",
        "summary": "Automate CI/CD pipelines and infrastructure.",
        "requirements": "Hands-on with Docker, Kubernetes, and Terraform.",
        "responsibilities": "Maintain deployment pipelines and observability tooling.",
        "skills": "Docker; Kubernetes; Terraform",
        "industry": "Information Technology"
    },
    {
        "title": "Cloud Engineer",
        "summary": "Manage cloud-native infrastructure for clients.",
        "requirements": "Certifications in AWS/Azure; scripting experience.",
        "responsibilities": "Provision and monitor multi-cloud environments.",
        "skills": "AWS; Azure; Python",
        "industry": "Information Technology"
    },
    {
        "title": "Data Analyst",
        "summary": "Derive insights from business data sets.",
        "requirements": "Strong SQL; dashboarding tools like Power BI.",
        "responsibilities": "Build dashboards and present trends to stakeholders.",
        "skills": "SQL; Power BI; Excel",
        "industry": "Information Technology"
    },
    {
        "title": "Data Scientist",
        "summary": "Develop predictive models for customer analytics.",
        "requirements": "Experience with Python ML stack; statistics foundation.",
        "responsibilities": "Experiment with models and productionize insights.",
        "skills": "Python; scikit-learn; TensorFlow",
        "industry": "Information Technology"
    },
    {
        "title": "Machine Learning Engineer",
        "summary": "Operationalize machine learning pipelines.",
        "requirements": "Experience with MLOps workflows and Docker.",
        "responsibilities": "Deploy and monitor ML models in production.",
        "skills": "MLflow; Docker; Kubernetes",
        "industry": "Information Technology"
    },
    {
        "title": "QA Engineer",
        "summary": "Ensure product quality through manual and automated testing.",
        "requirements": "Experience with Selenium or Cypress.",
        "responsibilities": "Design test plans, execute suites, and document defects.",
        "skills": "Selenium; Cypress; TestNG",
        "industry": "Information Technology"
    },
    {
        "title": "QA Automation Lead",
        "summary": "Lead automation strategy for SaaS platform.",
        "requirements": "5+ years building test automation frameworks.",
        "responsibilities": "Mentor QA team and maintain automation coverage.",
        "skills": "Java; Selenium; Jenkins",
        "industry": "Information Technology"
    },
    {
        "title": "Product Manager",
        "summary": "Drive roadmap for B2B digital products.",
        "requirements": "Prior product ownership; data-driven mindset.",
        "responsibilities": "Shape backlog, coordinate releases, track KPIs.",
        "skills": "Product strategy; Agile; Analytics",
        "industry": "Information Technology"
    },
    {
        "title": "UI/UX Designer",
        "summary": "Design intuitive user journeys across platforms.",
        "requirements": "Figma proficiency; user research experience.",
        "responsibilities": "Create wireframes, prototypes, and UI kits.",
        "skills": "Figma; Adobe XD; User research",
        "industry": "Information Technology"
    },
    {
        "title": "Android Developer",
        "summary": "Deliver native Android experiences for consumer apps.",
        "requirements": "Kotlin expertise; knowledge of Jetpack components.",
        "responsibilities": "Ship features, integrate APIs, fix defects.",
        "skills": "Kotlin; Android SDK; Retrofit",
        "industry": "Information Technology"
    },
    {
        "title": "iOS Developer",
        "summary": "Build performant iOS applications.",
        "requirements": "Swift/SwiftUI proficiency; MVVM patterns.",
        "responsibilities": "Develop features, write unit tests, optimize performance.",
        "skills": "Swift; SwiftUI; Xcode",
        "industry": "Information Technology"
    },
    {
        "title": "Security Analyst",
        "summary": "Monitor and respond to security incidents.",
        "requirements": "Knowledge of SIEM tools and incident response.",
        "responsibilities": "Investigate alerts, coordinate remediation, maintain runbooks.",
        "skills": "SIEM; Incident response; Linux",
        "industry": "Information Technology"
    },
    {
        "title": "Network Engineer",
        "summary": "Maintain enterprise routing and switching.",
        "requirements": "CCNA/CCNP level knowledge.",
        "responsibilities": "Manage network infrastructure and troubleshoot issues.",
        "skills": "Routing; Switching; Firewalls",
        "industry": "Information Technology"
    },
    {
        "title": "Database Administrator",
        "summary": "Administer mission-critical database systems.",
        "requirements": "Oracle/PostgreSQL performance tuning experience.",
        "responsibilities": "Maintain backups, optimize indexes, guide developers.",
        "skills": "Oracle; PostgreSQL; Shell scripting",
        "industry": "Information Technology"
    },
    {
        "title": "Solutions Architect",
        "summary": "Design scalable architectures for enterprise clients.",
        "requirements": "10+ years technology leadership; cloud expertise.",
        "responsibilities": "Gather requirements, create blueprints, support delivery teams.",
        "skills": "Architecture; Cloud; Microservices",
        "industry": "Information Technology"
    },
    {
        "title": "Business Analyst",
        "summary": "Translate business requirements into technical specs.",
        "requirements": "Experience in stakeholder management and documentation.",
        "responsibilities": "Facilitate workshops, write user stories, support UAT.",
        "skills": "Requirements gathering; SQL; Process mapping",
        "industry": "Information Technology"
    },
    {
        "title": "Technical Writer",
        "summary": "Create documentation for developer tools and APIs.",
        "requirements": "Exceptional technical writing and editing skills.",
        "responsibilities": "Produce guides, tutorials, and release notes.",
        "skills": "Technical writing; Markdown; API docs",
        "industry": "Information Technology"
    }
]

non_it_roles = [
    {
        "title": "Sales Manager",
        "summary": "Lead regional sales operations and achieve targets.",
        "requirements": "5+ years B2B/B2C sales leadership.",
        "responsibilities": "Coach team, forecast pipelines, close enterprise deals.",
        "skills": "Sales strategy; Negotiation; CRM",
        "industry": "Sales"
    },
    {
        "title": "Marketing Manager",
        "summary": "Drive integrated marketing campaigns for brand growth.",
        "requirements": "Hands-on with digital marketing channels.",
        "responsibilities": "Plan campaigns, manage agencies, analyse performance.",
        "skills": "SEO; SEM; Content marketing",
        "industry": "Marketing"
    },
    {
        "title": "HR Manager",
        "summary": "Handle end-to-end HR operations and engagement.",
        "requirements": "Experience in talent management and compliance.",
        "responsibilities": "Drive hiring, onboarding, L&D, and policy management.",
        "skills": "HR operations; Employee relations; Payroll",
        "industry": "Human Resources"
    },
    {
        "title": "Finance Analyst",
        "summary": "Support FP&A through budgeting and forecasting.",
        "requirements": "Strong analytical ability and Excel modeling.",
        "responsibilities": "Prepare budgets, track variances, present insights.",
        "skills": "Financial modeling; Excel; Power BI",
        "industry": "Finance"
    },
    {
        "title": "Accountant",
        "summary": "Manage daily bookkeeping and compliance.",
        "requirements": "Working knowledge of GST/TDS and accounting tools.",
        "responsibilities": "Record journal entries, reconcile ledgers, support audits.",
        "skills": "Accounting; Tally; Compliance",
        "industry": "Finance"
    },
    {
        "title": "Operations Manager",
        "summary": "Streamline business operations and service delivery.",
        "requirements": "Process improvement experience, strong leadership.",
        "responsibilities": "Manage teams, track SLAs, optimize workflows.",
        "skills": "Operations; Lean; Vendor management",
        "industry": "Operations"
    },
    {
        "title": "Supply Chain Manager",
        "summary": "Oversee procurement, logistics, and inventory planning.",
        "requirements": "Experience with SAP or ERP planning tools.",
        "responsibilities": "Plan demand, negotiate with vendors, manage logistics partners.",
        "skills": "Supply chain; Inventory planning; Negotiation",
        "industry": "Supply Chain"
    },
    {
        "title": "Logistics Coordinator",
        "summary": "Coordinate daily shipments and documentation.",
        "requirements": "Understanding of freight operations and systems.",
        "responsibilities": "Track deliveries, liaise with transporters, maintain records.",
        "skills": "Logistics; Documentation; Excel",
        "industry": "Logistics"
    },
    {
        "title": "Procurement Specialist",
        "summary": "Source vendors and manage procurement cycles.",
        "requirements": "Negotiation skills and contract management experience.",
        "responsibilities": "Run RFPs, finalise pricing, monitor savings.",
        "skills": "Procurement; Negotiation; Vendor management",
        "industry": "Procurement"
    },
    {
        "title": "Customer Service Executive",
        "summary": "Deliver delightful customer support experiences.",
        "requirements": "Excellent communication, empathy, and CRM skills.",
        "responsibilities": "Handle queries, resolve complaints, maintain records.",
        "skills": "Customer support; CRM; Communication",
        "industry": "Customer Service"
    },
    {
        "title": "Store Manager",
        "summary": "Manage retail store operations and staff.",
        "requirements": "Knowledge of merchandising and retail metrics.",
        "responsibilities": "Drive sales, coach associates, ensure compliance.",
        "skills": "Retail operations; Sales leadership; Inventory",
        "industry": "Retail"
    },
    {
        "title": "Hospitality Manager",
        "summary": "Oversee guest experience at premium property.",
        "requirements": "Hospitality management background.",
        "responsibilities": "Manage staff rosters, service standards, and guest feedback.",
        "skills": "Guest relations; Service quality; Team management",
        "industry": "Hospitality"
    },
    {
        "title": "Chef",
        "summary": "Lead kitchen operations and menu planning.",
        "requirements": "Culinary arts education and premium dining experience.",
        "responsibilities": "Design menu, ensure quality, manage kitchen brigade.",
        "skills": "Culinary skills; Menu design; HACCP",
        "industry": "Hospitality"
    },
    {
        "title": "Event Coordinator",
        "summary": "Plan and execute corporate events and weddings.",
        "requirements": "Vendor management and coordination skills.",
        "responsibilities": "Liaise with clients, plan logistics, manage on-ground execution.",
        "skills": "Event planning; Vendor relations; Budgeting",
        "industry": "Events"
    },
    {
        "title": "Administrative Assistant",
        "summary": "Provide administrative support to leadership.",
        "requirements": "Organisational skills and attention to detail.",
        "responsibilities": "Manage calendars, arrange travel, prepare documentation.",
        "skills": "Administration; Coordination; MS Office",
        "industry": "Administration"
    },
    {
        "title": "Executive Assistant",
        "summary": "Support CXO with scheduling, communications, and reporting.",
        "requirements": "Discretion, excellent communication, prioritisation.",
        "responsibilities": "Coordinate meetings, manage correspondence, prepare briefs.",
        "skills": "Executive support; Communication; Organisation",
        "industry": "Administration"
    },
    {
        "title": "Project Manager",
        "summary": "Lead cross-functional projects to completion.",
        "requirements": "PMP/Prince2 preferred; stakeholder management.",
        "responsibilities": "Plan, execute, and close projects within scope and budget.",
        "skills": "Project management; Risk management; Communication",
        "industry": "Project Management"
    },
    {
        "title": "Civil Engineer",
        "summary": "Execute site work for infrastructure projects.",
        "requirements": "Degree in civil engineering; AutoCAD skills.",
        "responsibilities": "Monitor progress, ensure quality, coordinate contractors.",
        "skills": "Civil engineering; AutoCAD; Site supervision",
        "industry": "Construction"
    },
    {
        "title": "Mechanical Engineer",
        "summary": "Support plant maintenance and equipment reliability.",
        "requirements": "Experience with preventive maintenance.",
        "responsibilities": "Plan maintenance schedules and troubleshoot breakdowns.",
        "skills": "Mechanical systems; Maintenance; SAP PM",
        "industry": "Manufacturing"
    },
    {
        "title": "Quality Supervisor",
        "summary": "Manage quality assurance in manufacturing facility.",
        "requirements": "Knowledge of ISO standards and QA processes.",
        "responsibilities": "Monitor QA metrics, conduct audits, implement improvements.",
        "skills": "Quality control; ISO; Root cause analysis",
        "industry": "Manufacturing"
    },
    {
        "title": "Nurse",
        "summary": "Provide patient care in multi-specialty hospital.",
        "requirements": "B.Sc. Nursing with valid registration.",
        "responsibilities": "Administer medication, monitor vitals, assist doctors.",
        "skills": "Clinical care; Patient support; Record keeping",
        "industry": "Healthcare"
    }
]

companies_it = [
    "TechNova Labs",
    "BlueRiver Systems",
    "Elevate Digital",
    "Nimbus Works",
    "InsightIQ Analytics",
    "PrimeQuality Labs",
    "Luminary Tech",
    "MobileForge Labs",
    "SecureNet Solutions",
    "CoreData Hub",
    "AgileEdge",
    "DocuCraft Studios",
    "MetroSys IT",
    "ChainCraft Labs",
    "ImmersiveWave",
    "Sapphire ERP",
    "DataSight Analytics",
    "HelpDesk Pro",
    "Orion Retail IT",
    "Streamline Data",
    "SiliconWorks",
    "AutomatePro",
    "CloudArc Support"
]

companies_non_it = [
    "Orion Retail",
    "Luminary Marketing",
    "TechNova Corporate",
    "BlueRiver Finance",
    "Nimbus Operations",
    "SupplySphere",
    "LogiTrack",
    "ProcurePlus",
    "HelpDesk Customer Care",
    "RetailVista",
    "Gourmet Haven",
    "GrandStay Hotels",
    "BuildStrong Infra",
    "CivicConstructions",
    "AutoMech Industries",
    "PureHealth Hospitals",
    "EverGlow Wellness",
    "GreenLeaf Organics",
    "Skyline Events",
    "Metro Logistics",
    "BrightFuture Education",
    "CareFirst Healthcare",
    "UrbanEats"
]

locations_it = [
    "Bengaluru, IN",
    "Hyderabad, IN",
    "Pune, IN",
    "Chennai, IN",
    "Mumbai, IN",
    "Gurugram, IN",
    "Noida, IN",
    "Delhi, IN",
    "Kochi, IN",
    "Ahmedabad, IN",
    "Jaipur, IN",
    "Indore, IN"
]

locations_non_it = [
    "Delhi, IN",
    "Mumbai, IN",
    "Bengaluru, IN",
    "Chennai, IN",
    "Hyderabad, IN",
    "Kolkata, IN",
    "Pune, IN",
    "Jaipur, IN",
    "Chandigarh, IN",
    "Lucknow, IN",
    "Goa, IN",
    "Ahmedabad, IN"
]

job_types = [
    "FULL_TIME",
    "FULL_TIME",
    "FULL_TIME",
    "CONTRACT",
    "PART_TIME"
]

work_modes = [
    "ONSITE",
    "HYBRID",
    "REMOTE"
]

experience_levels = [
    ("ENTRY", 0, 2),
    ("MID", 3, 6),
    ("SENIOR", 7, 12)
]

benefits_catalog = [
    "Health insurance; PF; Bonus",
    "Flexible schedule; Wellness programs",
    "Remote work stipend; Learning budget",
    "Annual bonus; Stock options",
    "Relocation support; Insurance"
]

education_it = [
    "B.Tech Computer Science",
    "B.E. Information Technology",
    "M.Tech Data Science",
    "B.Sc. Computer Science",
    "BCA"
]

education_non_it = [
    "MBA",
    "BBA",
    "B.Com",
    "Hotel Management",
    "B.Sc. Nursing",
    "Diploma"
]

application_deadline = datetime(2025, 12, 31, 23, 59, 59)
# Update this list to match employer user IDs in your database.
employer_ids = [2]

entries = []

for idx in range(60):
    role = it_roles[idx % len(it_roles)]
    company = random.choice(companies_it)
    location = random.choice(locations_it)
    job_type = random.choice(job_types)
    work_mode = random.choice(work_modes)
    level, base_min, base_max = experience_levels[idx % len(experience_levels)]
    if level == "ENTRY":
        min_exp = 0
        max_exp = random.randint(1, 3)
    elif level == "MID":
        min_exp = random.randint(3, 5)
        max_exp = min_exp + random.randint(1, 3)
    else:
        min_exp = random.randint(7, 9)
        max_exp = min_exp + random.randint(2, 4)
    salary_band = random.choice([
        f"INR {random.randint(4, 8)}-{random.randint(9, 16)} LPA",
        f"INR {random.randint(6, 10)}-{random.randint(12, 20)} LPA"
    ])
    entry = {
        "title": role["title"],
        "company": company,
        "location": location,
        "job_type": job_type,
        "work_mode": work_mode,
        "experience_level": level,
        "description": role["summary"],
        "requirements": role["requirements"],
        "responsibilities": role["responsibilities"],
        "salary": salary_band,
        "skills": role["skills"],
        "min_experience": min_exp,
        "max_experience": max_exp,
        "education": random.choice(education_it),
        "industry": role["industry"],
        "benefits": random.choice(benefits_catalog),
        "deadline": application_deadline,
        "status": "ACTIVE",
        "employer_id": random.choice(employer_ids)
    }
    entries.append(entry)

for idx in range(60):
    role = non_it_roles[idx % len(non_it_roles)]
    company = random.choice(companies_non_it)
    location = random.choice(locations_non_it)
    job_type = random.choice(job_types)
    work_mode = random.choice(work_modes)
    level, base_min, base_max = experience_levels[idx % len(experience_levels)]
    if level == "ENTRY":
        min_exp = 0
        max_exp = random.randint(1, 3)
    elif level == "MID":
        min_exp = random.randint(3, 6)
        max_exp = min_exp + random.randint(1, 3)
    else:
        min_exp = random.randint(7, 9)
        max_exp = min_exp + random.randint(2, 5)
    salary_band = random.choice([
        f"INR {random.randint(3, 6)}-{random.randint(7, 12)} LPA",
        f"INR {random.randint(6, 10)}-{random.randint(11, 18)} LPA"
    ])
    entry = {
        "title": role["title"],
        "company": company,
        "location": location,
        "job_type": job_type,
        "work_mode": work_mode,
        "experience_level": level,
        "description": role["summary"],
        "requirements": role["requirements"],
        "responsibilities": role["responsibilities"],
        "salary": salary_band,
        "skills": role["skills"],
        "min_experience": min_exp,
        "max_experience": max_exp,
        "education": random.choice(education_non_it),
        "industry": role["industry"],
        "benefits": random.choice(benefits_catalog),
        "deadline": application_deadline,
        "status": "ACTIVE",
        "employer_id": random.choice(employer_ids)
    }
    entries.append(entry)

lines = [
    "USE jobportal;",
    "",
    "SET @now = NOW();",
    "",
    "INSERT INTO jobs (",
    "    title, company, location, job_type, work_mode, experience_level,",
    "    description, requirements, responsibilities, salary, skills,",
    "    min_experience, max_experience, education, industry, benefits,",
    "    application_deadline, status, employer_id, created_at, updated_at",
    ") VALUES"
]

value_rows = []
for entry in entries:
    def esc(value: str) -> str:
        return value.replace("'", "''")

    row = "    (" + ", ".join([
        f"'{esc(entry['title'])}'",
        f"'{esc(entry['company'])}'",
        f"'{esc(entry['location'])}'",
        f"'{entry['job_type']}'",
        f"'{entry['work_mode']}'",
        f"'{entry['experience_level']}'",
        f"'{esc(entry['description'])}'",
        f"'{esc(entry['requirements'])}'",
        f"'{esc(entry['responsibilities'])}'",
        f"'{esc(entry['salary'])}'",
        f"'{esc(entry['skills'])}'",
        str(entry['min_experience']),
        str(entry['max_experience']),
        f"'{esc(entry['education'])}'",
        f"'{esc(entry['industry'])}'",
        f"'{esc(entry['benefits'])}'",
        f"'{entry['deadline'].strftime('%Y-%m-%d %H:%M:%S')}'",
        f"'{entry['status']}'",
        str(entry['employer_id']),
        "@now",
        "@now"
    ]) + ")"
    value_rows.append(row)

lines.append(",\n".join(value_rows) + ";")

output_path = Path("JobportalBackend/db/seeds")
output_path.mkdir(parents=True, exist_ok=True)


def write_sql(filename: str, statement_lines: list[str]) -> None:
    (output_path / filename).write_text("\n".join(statement_lines), encoding="utf-8")


def esc(value: str) -> str:
    return value.replace("'", "''")


# ---------------------------------------------------------------------------
# Generate applicant accounts
# ---------------------------------------------------------------------------

applicant_first_names = [
    "Aarav", "Isha", "Dev", "Ananya", "Rohan",
    "Sneha", "Kabir", "Meera", "Vihaan", "Riya",
    "Arjun", "Lakshmi", "Kiran", "Pooja", "Nikhil",
    "Rahul", "Divya", "Harsh", "Tanya", "Aditya"
]

applicant_last_names = [
    "Patel", "Sharma", "Reddy", "Iyer", "Khan",
    "Mehta", "Das", "Singh", "Verma", "Gupta",
    "Bose", "Joshi", "Kulkarni", "Menon", "Chatterjee"
]

skill_bank = [
    "Java; Spring Boot; MySQL",
    "React; TypeScript; Redux",
    "Python; Pandas; SQL",
    "Node.js; Express; MongoDB",
    "UI/UX; Figma; Prototyping",
    "Digital Marketing; SEO; Content",
    "Sales; Negotiation; CRM",
    "Customer Support; Zendesk; Escalations",
    "Project Management; Agile; JIRA",
    "Finance; Excel; Budgeting",
    "Data Science; TensorFlow; Statistics"
]

applicant_education = [
    "B.Tech Computer Science", "B.Sc. Information Technology",
    "MBA Marketing", "B.Com Finance", "B.A. Economics",
    "B.Des Communication", "BCA", "BBA", "M.Tech Data Science",
    "MCA", "BHM"
]

experience_buckets = ["Fresher", "1-2 years", "3-4 years", "5+ years"]

applicant_lines = [
    "USE jobportal;",
    "",
    "SET @now = NOW();",
    "",
    "INSERT INTO applicant_accounts (",
    "    id, email, password, full_name, phone, bio, skills, experience, education, resume_url,",
    "    created_at, updated_at",
    ") VALUES"
]

applicant_rows = []
for idx in range(1, APPLICANT_COUNT + 1):
    first = random.choice(applicant_first_names)
    last = random.choice(applicant_last_names)
    full_name = f"{first} {last}"
    email = f"{first.lower()}.{last.lower()}{idx}@example.in"
    phone = f"+91-9{random.randint(100000000, 999999999)}"
    bio = "Ambitious professional seeking to contribute to a high-growth organisation."
    skills = random.choice(skill_bank)
    experience = random.choice(experience_buckets)
    education = random.choice(applicant_education)
    resume_url = f"https://example.com/resume{idx}.pdf"

    applicant_rows.append(
        "    (" + ", ".join([
            str(idx),
            f"'{esc(email)}'",
            f"'{PASSWORD_HASH}'",
            f"'{esc(full_name)}'",
            f"'{phone}'",
            f"'{esc(bio)}'",
            f"'{esc(skills)}'",
            f"'{experience}'",
            f"'{esc(education)}'",
            f"'{resume_url}'",
            "@now",
            "@now"
        ]) + ")"
    )

applicant_lines.append(",\n".join(applicant_rows) + ";")
write_sql("applicant_accounts_seed.sql", applicant_lines)

print(f"Generated {len(applicant_rows)} applicant rows at {output_path / 'applicant_accounts_seed.sql'}")


# ---------------------------------------------------------------------------
# Generate employer accounts
# ---------------------------------------------------------------------------

employers_catalog = [
    {
        "contact": "KKN Recruiters",
        "email": "hr@kknrecruiters.com",
        "company": "KKN Recruiters",
        "website": "https://kknrecruiters.com",
        "location": "Bengaluru, IN",
        "description": "Boutique hiring firm connecting top talent with innovative employers.",
        "phone": "+91-8045001100"
    },
    {
        "contact": "Nimbus Talent",
        "email": "careers@nimbustalent.com",
        "company": "Nimbus Talent",
        "website": "https://nimbustalent.com",
        "location": "Hyderabad, IN",
        "description": "Full-service staffing partner for technology and operations teams.",
        "phone": "+91-4042317788"
    },
    {
        "contact": "MetroSys HR",
        "email": "talent@metrosyshr.com",
        "company": "MetroSys HR",
        "website": "https://metrosyshr.com",
        "location": "Mumbai, IN",
        "description": "Supporting scaling startups with leadership and product hiring.",
        "phone": "+91-2241256699"
    },
    {
        "contact": "Sapphire Careers",
        "email": "jobs@sapphirecareers.com",
        "company": "Sapphire Careers",
        "website": "https://sapphirecareers.com",
        "location": "Chennai, IN",
        "description": "Matching professionals to finance, analytics, and IT roles since 2012.",
        "phone": "+91-4445098822"
    },
    {
        "contact": "Insight Recruit",
        "email": "hello@insightrecruit.com",
        "company": "Insight Recruit",
        "website": "https://insightrecruit.com",
        "location": "Delhi, IN",
        "description": "Talent acquisition specialists for product and consulting firms.",
        "phone": "+91-1143685544"
    },
    {
        "contact": "BlueRiver Logistics",
        "email": "team@blueriverlogistics.com",
        "company": "BlueRiver Logistics",
        "website": "https://blueriverlogistics.com",
        "location": "Gurugram, IN",
        "description": "Pan-India logistics partner optimising supply chains for retail leaders.",
        "phone": "+91-1247790034"
    },
    {
        "contact": "UrbanEats Hospitality",
        "email": "jobs@urbaneats.in",
        "company": "UrbanEats Hospitality",
        "website": "https://urbaneats.in",
        "location": "Pune, IN",
        "description": "Modern hospitality group operating boutique restaurants across India.",
        "phone": "+91-2066604411"
    },
    {
        "contact": "GreenLeaf Organics",
        "email": "careers@greenleaforganics.in",
        "company": "GreenLeaf Organics",
        "website": "https://greenleaforganics.in",
        "location": "Bengaluru, IN",
        "description": "Sustainable FMCG brand delivering farm-to-table organic produce.",
        "phone": "+91-8040127788"
    },
    {
        "contact": "BrightFuture Education",
        "email": "talent@brightfutureedu.org",
        "company": "BrightFuture Education",
        "website": "https://brightfutureedu.org",
        "location": "Kolkata, IN",
        "description": "K-12 education network focused on blended learning programmes.",
        "phone": "+91-3345089922"
    },
    {
        "contact": "CareFirst Healthcare",
        "email": "hr@carefirsthealthcare.in",
        "company": "CareFirst Healthcare",
        "website": "https://carefirsthealthcare.in",
        "location": "Ahmedabad, IN",
        "description": "Multi-specialty healthcare provider expanding across Western India.",
        "phone": "+91-7943098877"
    },
    {
        "contact": "Orion Retail",
        "email": "team@orionretail.in",
        "company": "Orion Retail",
        "website": "https://orionretail.in",
        "location": "Lucknow, IN",
        "description": "Retail chain bringing curated lifestyle products to tier-2 cities.",
        "phone": "+91-5227783344"
    },
    {
        "contact": "Skyline Events",
        "email": "events@skylineevents.in",
        "company": "Skyline Events",
        "website": "https://skylineevents.in",
        "location": "Hyderabad, IN",
        "description": "Event management specialists for corporate and luxury weddings.",
        "phone": "+91-4066102288"
    }
]

if EMPLOYER_COUNT > len(employers_catalog):
    raise ValueError("EMPLOYER_COUNT exceeds available employer profiles.")

employer_lines = [
    "USE jobportal;",
    "",
    "SET @now = NOW();",
    "",
    "INSERT INTO employer_accounts (",
    "    id, email, password, contact_name, phone, company_name, company_description,",
    "    company_website, company_location, created_at, updated_at",
    ") VALUES"
]

employer_rows = []
selected_employers = employers_catalog[:EMPLOYER_COUNT]

for idx, profile in enumerate(selected_employers, start=1):
    employer_rows.append(
        "    (" + ", ".join([
            str(idx),
            f"'{esc(profile['email'])}'",
            f"'{PASSWORD_HASH}'",
            f"'{esc(profile['contact'])}'",
            f"'{profile['phone']}'",
            f"'{esc(profile['company'])}'",
            f"'{esc(profile['description'])}'",
            f"'{profile['website']}'",
            f"'{esc(profile['location'])}'",
            "@now",
            "@now"
        ]) + ")"
    )

employer_lines.append(",\n".join(employer_rows) + ";")
write_sql("employer_accounts_seed.sql", employer_lines)

print(f"Generated {len(employer_rows)} employer rows at {output_path / 'employer_accounts_seed.sql'}")


# ---------------------------------------------------------------------------
# Generate jobs
# ---------------------------------------------------------------------------

role_pool = [("IT", role) for role in it_roles] + [("NON_IT", role) for role in non_it_roles]

job_lines = [
    "USE jobportal;",
    "",
    "SET @now = NOW();",
    "",
    "INSERT INTO jobs (",
    "    title, company, location, job_type, work_mode, experience_level,",
    "    description, requirements, responsibilities, salary, skills,",
    "    min_experience, max_experience, education, industry, benefits,",
    "    application_deadline, status, employer_id, created_at, updated_at",
    ") VALUES"
]

job_rows = []

for idx in range(1, JOB_COUNT + 1):
    sector, role = random.choice(role_pool)
    if sector == "IT":
        company = random.choice(companies_it)
        location = random.choice(locations_it)
        education = random.choice(education_it)
    else:
        company = random.choice(companies_non_it)
        location = random.choice(locations_non_it)
        education = random.choice(education_non_it)

    job_type = random.choice(job_types)
    work_mode = random.choice(work_modes)
    experience_level, base_min, base_max = random.choice(experience_levels)

    if experience_level == "ENTRY":
        min_exp = 0
        max_exp = random.randint(1, 3)
    elif experience_level == "MID":
        min_exp = random.randint(3, 6)
        max_exp = min_exp + random.randint(1, 3)
    else:
        min_exp = random.randint(7, 10)
        max_exp = min_exp + random.randint(2, 4)

    salary_band = random.choice([
        f"INR {random.randint(3, 6)}-{random.randint(8, 12)} LPA",
        f"INR {random.randint(6, 10)}-{random.randint(13, 20)} LPA"
    ])

    deadline = datetime.now() + timedelta(days=random.randint(30, 120))
    employer_id = ((idx - 1) % EMPLOYER_COUNT) + 1

    job_rows.append(
        "    (" + ", ".join([
            f"'{esc(role['title'])}'",
            f"'{esc(company)}'",
            f"'{esc(location)}'",
            f"'{job_type}'",
            f"'{work_mode}'",
            f"'{experience_level}'",
            f"'{esc(role['summary'])}'",
            f"'{esc(role['requirements'])}'",
            f"'{esc(role['responsibilities'])}'",
            f"'{esc(salary_band)}'",
            f"'{esc(role['skills'])}'",
            str(min_exp),
            str(max_exp),
            f"'{esc(education)}'",
            f"'{esc(role['industry'])}'",
            f"'{esc(random.choice(benefits_catalog))}'",
            f"'{deadline.strftime('%Y-%m-%d %H:%M:%S')}'",
            "'ACTIVE'",
            str(employer_id),
            "@now",
            "@now"
        ]) + ")"
    )

job_lines.append(",\n".join(job_rows) + ";")
write_sql("jobs_seed.sql", job_lines)

print(f"Generated {len(job_rows)} job rows at {output_path / 'jobs_seed.sql'}")


# ---------------------------------------------------------------------------
# Generate job applications
# ---------------------------------------------------------------------------

application_statuses = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "ACCEPTED"]
cover_letters = [
    "I am excited about the opportunity and believe my skills are a great match.",
    "I have delivered similar projects and would love to contribute to your team.",
    "My background aligns well with the requirements outlined in the job posting.",
    "I am passionate about this domain and eager to bring value to your organisation.",
    "Attached resume outlines relevant accomplishments that make me a strong candidate."
]
notes_pool = [
    "Needs follow-up call",
    "Promising profile",
    "Schedule technical round",
    "Good cultural fit",
    "",
]

application_lines = [
    "USE jobportal;",
    "",
    "SET @now = NOW();",
    "",
    "INSERT INTO job_applications (",
    "    job_id, applicant_id, cover_letter, resume_url, status, notes, applied_at, updated_at",
    ") VALUES"
]

application_rows = []
job_ids = list(range(1, JOB_COUNT + 1))
applicant_ids = list(range(1, APPLICANT_COUNT + 1))

for _ in range(APPLICATION_COUNT):
    job_id = random.choice(job_ids)
    applicant_id = random.choice(applicant_ids)
    applied_at = datetime.now() - timedelta(days=random.randint(0, 180))
    updated_at = applied_at + timedelta(days=random.randint(0, 30))
    status = random.choice(application_statuses)
    notes = random.choice(notes_pool)

    application_rows.append(
        "    (" + ", ".join([
            str(job_id),
            str(applicant_id),
            f"'{esc(random.choice(cover_letters))}'",
            f"'https://example.com/resume{applicant_id}.pdf'",
            f"'{status}'",
            f"'{esc(notes)}'" if notes else "NULL",
            f"'{applied_at.strftime('%Y-%m-%d %H:%M:%S')}'",
            f"'{updated_at.strftime('%Y-%m-%d %H:%M:%S')}'"
        ]) + ")"
    )

application_lines.append(",\n".join(application_rows) + ";")
write_sql("job_applications_seed.sql", application_lines)

print(f"Generated {len(application_rows)} job application rows at {output_path / 'job_applications_seed.sql'}")
