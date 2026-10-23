import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";

interface Attendee {
  fullName: Abhay Pandey;
  githubUsername: Abhay-pandey-cs;
  pfpUrl?: https://avatars.githubusercontent.com/u/136452579?s=400&u=622bda8353fd3aad13d7eb0d4fdb542097656aa5&v=4;
}

async function getAttendees(): Promise<Attendee[]> {
  const attendeesDirectory = path.join(process.cwd(), "app", "attendees");

  try {
    const files = await fs.readdir(attendeesDirectory);

    const attendees = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            const filePath = path.join(attendeesDirectory, file);
            const content = await fs.readFile(filePath, "utf-8");
            const attendee = JSON.parse(content) as Attendee;

            if (!attendee.fullName || !attendee.githubUsername) {
              return null;
            }

            return attendee;
          } catch {
            return null;
          }
        }),
    );

    return attendees
      .filter((attendee): attendee is Attendee => attendee !== null)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  } catch {
    return [];
  }
}

export default async function AttendeesPage() {
  const attendees = await getAttendees();

  return (
    <main className="min-h-screen overflow-hidden bg-[#111111] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="border-b border-white/20 pb-10">
          <p className="mb-5 inline-flex bg-[#ffc329] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-black sm:text-xs">
            Hacktoberfest · Phagwara · 2026
          </p>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-12">
            <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.08em]">
              Meet the
              <span className="block text-[#7ec8ed]">Builders.</span>
            </h1>

            <div className="lg:justify-self-end">
              <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                A community of developers, open-source contributors, and
                curious minds building together. Every profile represents
                someone who showed up to learn, share, and contribute.
              </p>

              <a
                href="https://github.com/shashankpandey04/hacktoberfest-meetup-phagwara"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 border border-white/25 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors hover:border-[#ffc329] hover:text-[#ffc329]"
              >
                Contribute on GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/20 py-6">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#ffc329]">
              THE COMMUNITY
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] sm:text-3xl">
              Attendee Directory
            </h2>
          </div>

          <p className="font-mono text-sm text-white/55">
            <span className="text-[#7ec8ed]">{attendees.length}</span>{" "}
            {attendees.length === 1 ? "BUILDER" : "BUILDERS"}
          </p>
        </div>

        {attendees.length > 0 ? (
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {attendees.map((attendee) => {
              const avatar =
                attendee.pfpUrl ||
                `https://github.com/${encodeURIComponent(attendee.githubUsername)}.png`;

              return (
                <a
                  key={attendee.githubUsername}
                  href={`https://github.com/${encodeURIComponent(attendee.githubUsername)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-0 flex-col bg-[#111111] p-5 transition-colors hover:bg-[#191919] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/15 bg-white/5">
                      <Image
                        src={avatar}
                        alt={`${attendee.fullName}'s GitHub avatar`}
                        fill
                        sizes="64px"
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <span className="font-mono text-lg text-white/30 transition-colors group-hover:text-[#ffc329]">
                      ↗
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="break-words text-lg font-bold tracking-tight transition-colors group-hover:text-[#7ec8ed]">
                      {attendee.fullName}
                    </h3>

                    <p className="mt-1 break-all font-mono text-xs text-white/45">
                      @{attendee.githubUsername}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4">
                    <span className="h-2 w-2 bg-[#ffc329]" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                      Community Builder
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-white/20 px-5 py-16 text-center sm:py-24">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#ffc329]">
              Be the first
            </p>

            <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
              Your name belongs here.
            </h3>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/55">
              Add your attendee profile to the repository and submit a pull
              request. Once it is merged and deployed, your profile can appear
              in this directory.
            </p>

            <a
              href="https://github.com/shashankpandey04/hacktoberfest-meetup-phagwara"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex bg-[#ffc329] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#7ec8ed]"
            >
              Add Your Profile ↗
            </a>
          </div>
        )}

        <footer className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Hacktoberfest Meetup Phagwara 2026</p>
          <p>Built by the community, for the community.</p>
        </footer>
      </div>
    </main>
  );
}
