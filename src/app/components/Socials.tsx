import Link from "next/link"
import { DiscordLogoIcon, GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const Socials = () => {
  return (
    <>
        <div className="flex flex-row md:flex-col md:gap-5 pt-24 justify-around">
          <Link href="https://discord.gg/EeVuh24q8E"><DiscordLogoIcon width="38" height="38"/></Link>
          <Link href="https://github.com/olafnub/base-pnl"><GitHubLogoIcon width="38" height="38"/></Link>
          <Link href="https://x.com/360beez"><TwitterLogoIcon width="38" height="38"/></Link>
        </div>
    </>
  )
}

export default Socials