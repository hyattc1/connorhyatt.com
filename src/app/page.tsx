import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Posts from "@/components/Posts";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/lib/posts";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRightIcon,
  FileDown,
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
              For Q&A, raise a ticket with Connor Support
            </p>
            <ArrowDownRight className="hidden size-5 animate-bounce sm:block" />
            <ArrowDown className="block size-5 animate-bounce sm:hidden" />
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
