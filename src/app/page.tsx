import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Posts from "@/components/Posts";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import ClickableConnorSupport from "@/components/ClickableConnorSupport";
import { getPosts } from "@/lib/posts";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRightIcon,
  FileDown,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");
const CONNOR_BIRTH_DATE = new Date(2004, 6, 6); // July 6, 2004 (month is 0-indexed)
const LIMIT = 2; // max show 2

// Function to calculate exact age
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default async function Home() {
  const posts = await getPosts(blogDirectory, LIMIT);

  return (
    <article className="mt-8 flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <Image
          className="rounded-lg"
          src="/connor.jpg"
          alt="Photo of Connor"
          width={175}
          height={175}
          priority
        />
        <div className="flex max-w-[320px] flex-col sm:max-w-full">
                     <h1 className="title text-balance text-4xl sm:text-5xl">
            hi connor here. ✌
           </h1>

                     <p className="mt-2 whitespace-nowrap text-sm font-medium sm:text-base">
             {calculateAge(CONNOR_BIRTH_DATE)}
             yo student from Pittsburgh, PA, USA
           </p>

          <p className="mt-4 max-w-sm text-balance text-sm sm:text-base">
            Analytics first, tech second. I uncover meaning in data and build tools that work.
          </p>

          <div className="mt-6 flex items-center gap-1">
            <p className="text-balance text-sm font-semibold sm:text-base">
              For Q&A, raise a ticket with <ClickableConnorSupport />
            </p>
            <div className="group relative">
              <Info className="hidden size-5 animate-bounce text-foreground group-hover:text-muted-foreground transition-colors sm:block" />
              <Info className="block size-5 animate-bounce text-foreground group-hover:text-muted-foreground transition-colors sm:hidden" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                I&apos;m a chatbot that knows about Connor&apos;s background, skills, projects, and career goals
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
              </div>
            </div>
          </div>

          <p className="mt-1 text-xs font-light">
            For escalations, please find my
            <Link
              href="https://www.linkedin.com/in/connorhyatt"
              target="_blank"
              className="link font-semibold"
              title="LinkedIn"
            >
              &nbsp;Connor Lead&nbsp;
            </Link>
            instead.
          </p>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/resume.pdf" target="_blank">
              <Button variant="outline">
                <span className="font-semibold">Resume</span>
                <FileDown className="ml-2 size-5" />
              </Button>
            </Link>
            <Socials />
          </section>
        </div>
      </section>

      <Experience />

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">featured projects</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-3xl">recent posts</h2>
          <LinkWithIcon
            href="/blog"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Posts posts={posts} />
      </section>
    </article>
  );
}
