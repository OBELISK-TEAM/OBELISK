import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col border-t border-border p-3 text-center text-xs text-muted-foreground">
      <div>Design and development by OBELISK Team:</div>
      <div className="flex justify-center gap-4">
        <Link href="https://www.linkedin.com/in/adam-bi%C5%9Bta-948720231/">
          https://www.linkedin.com/in/adam-bi%C5%9Bta-948720231/
        </Link>
        <Link href="https://www.linkedin.com/in/gracjan-filipek-13a4112b5/">
          https://www.linkedin.com/in/gracjan-filipek-13a4112b5/
        </Link>
        <Link href="https://www.linkedin.com/in/pawel-konop/">https://www.linkedin.com/in/pawel-konop/</Link>
        <Link href="https://www.linkedin.com/in/wiktorwilkusz/">https://www.linkedin.com/in/wiktorwilkusz/</Link>
      </div>
      <div>&nbsp;</div>
      <div>© 2024. All Rights Reserved</div>
      <div>
        OBELISK Pre-Alpha:{" "}
        <Link href="https://github.com/OBELISK-TEAM/OBELISK/tree/develop">
          https://github.com/OBELISK-TEAM/OBELISK/tree/develop
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
