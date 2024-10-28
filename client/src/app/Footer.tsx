import Link from "next/link";

const Footer = () => {
  const teamMembers = [
    { name: "Adam Biśta", href: "https://www.linkedin.com/in/adam-bi%C5%9Bta-948720231/" },
    { name: "Gracjan Filipek", href: "https://www.linkedin.com/in/gracjan-filipek-13a4112b5/" },
    { name: "Paweł Konop", href: "https://www.linkedin.com/in/pawel-konop/" },
    { name: "Wiktor Wilkusz", href: "https://www.linkedin.com/in/wiktorwilkusz/" },
  ];

  return (
    <footer className="flex flex-col border-t border-border p-3 text-xs text-muted-foreground">
      <div className="container mx-auto flex flex-wrap justify-around">
        {/* Brand and Project Info */}
        <div className="min-w-[200px]">
          <h3 className="text-s mb-2 font-semibold">OBELISK Project</h3>
          <p>© 2024. All Rights Reserved</p>
          <p>OBELISK Pre-Alpha:</p>
          <Link
            href="https://github.com/OBELISK-TEAM/OBELISK/tree/develop"
            target="_blank"
            className="underline hover:text-foreground"
          >
            https://github.com/OBELISK-TEAM/OBELISK/tree/develop
          </Link>
        </div>

        {/* Team & Social Links */}
        <div className="min-w-[200px]">
          <h3 className="text-s mb-2 font-semibold">Design and Development by OBELISK Team</h3>
          {teamMembers.map((member) => (
            <p key={member.href}>
              <Link href={member.href} target="_blank" className="underline hover:text-foreground">
                {member.name}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
