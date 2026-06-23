import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash,
    },
  });

  const articlesData = [
    {
      title: "Привіт, світе!",
      body: "Це перша стаття в нашому блозі — створена при seed.",
    },
    {
      title: "Чому React 19 — це круто",
      body: "У React 19 з'явився use() API, нові компайлери і багато іншого.",
    },
    {
      title: "Tailwind v4 без конфігу",
      body: "У Tailwind v4 більше не потрібен tailwind.config.js, все робиться через CSS.",
    },
  ];

  for (const data of articlesData) {
    await prisma.article.create({
      data: {
        ...data,
        authorId: demoUser.id,
      },
    });
  }

  console.log("✅ Seed completed");
  console.log(`   1 user (demo@example.com / demo1234)`);
  console.log(`   ${articlesData.length} articles`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
