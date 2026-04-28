import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contactMessage.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        titleEn: "Flowly — Financial Analytics Platform",
        titlePt: "Flowly — Plataforma de Análise Financeira",
        descriptionEn:
          "A backend-focused financial platform designed around REST APIs, PostgreSQL reporting queries, Redis caching and async processing patterns.",
        descriptionPt:
          "Plataforma financeira com foco em backend, construída em torno de APIs REST, consultas analíticas em PostgreSQL, cache com Redis e padrões assíncronos.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1400&auto=format&fit=crop",
        githubUrl: "https://github.com/MathiRD",
        liveUrl: "",
        techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        featured: true,
        published: true
      },
      {
        titleEn: "IoT Access Control API",
        titlePt: "API de Controle de Acesso IoT",
        descriptionEn:
          "A REST API running on Raspberry Pi for RFID event processing, JWT authentication and CSV reporting.",
        descriptionPt:
          "API REST em Raspberry Pi para processamento de eventos RFID, autenticação JWT e relatórios CSV.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
        githubUrl: "https://github.com/MathiRD",
        liveUrl: "",
        techStack: ["Python", "Flask", "Raspberry Pi", "JWT"],
        featured: false,
        published: true
      }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
