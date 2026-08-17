---
layout: post
title: There's a new "Google Jail" for independent wikis
author: cookmeplox
excerpt_separator: <!--excerpt-->
---
Big week! We just finished moving the [Overwatch](https://overwatch.weirdgloop.org) and [Fortnite](https://fortnite.weirdgloop.org) wikis off of Fandom. It’s still my favorite thing in the world to help wiki editors grab control of their projects and make them awesome (and not covered with a dozen auto-playing video ads!)
<!--excerpt-->

Unlike most of the other wikis we host ([runescape.wiki](https://runescape.wiki), [minecraft.wiki](https://minecraft.wiki), [gta.wiki](https://gta.wiki)...), both Overwatch and Fortnite are launching at subdomains of weirdgloop.org instead of on their own root domain, like (say) overwatch.wiki. There is an unusually good reason for this, and the rest of this post will be going into excruciating detail about:
* a frustrating change that Google made in early 2024 to how it treats brand-new-domains
* the wide-ranging effects of these changes on the entire independent wiki ecosystem
* how I’m trying to work around this new “Google Jail” for the wikis that we host

## If you have a new domain, only the main page shows up on Google search results
These March 2024 changes have a specific "failure mode" on Google Search which has made it even more difficult for a certain class of new wikis (and most likely, new websites in general) to show up in search results. For the last two years, with very few exceptions, **wikis on brand new domains will not show up on Google Search for anything other than the main page.**

Since ~85% of video game wiki traffic comes from Google, and wikis (obviously) have many popular pages other than the main page, this is a pretty catastrophic outcome.

<div style="text-align: center;">
    <img src="/images/posts/google_jail_graph.png" alt="Google jail graph" width="800px" />
    <div style="margin-bottom: 1em; font-size: 0.9em; font-style: italic;">
     Hollow Knight wiki: into Google Jail in March 2024, back out 9 months later
    </div>
</div>

Here’s what we think we know:

* This has happened to about 90% of wikis I'm aware of that have launched on brand new domains since the [March 2024 Google core update](https://developers.google.com/search/blog/2024/03/core-update-spam-policies). This includes gta.wiki and hytalewiki.org that we host, hollowknight.wiki, the official [Path of Exile 2 wiki](https://poe2wiki.net), and a couple dozen smaller wikis
* This happens regardless of whether the content is brand-new, or derived from something else (like Fandom) that Google is already indexing. It’s not the conventional “duplicate content” issue that wikis have had to deal with for the last decade.
* It doesn’t seem to have much to do with the actual “ranking” of the domain - there’s quite a few examples where the main page is actually beating Fandom’s main page on Google, and yet that’s the only page that shows up at all for the entire domain.
* This "Google Jail" lasts for an unclear period of time, sometimes up to a year, and is also sometimes"defeated" by big game updates that cause significant new traffic/content to come to the wiki. [Undertale](https://undertale.wiki/) and [Vampire Survivors](https://vampire.survivors.wiki/) are examples of wikis that defeated the Google Jail by waiting it out and having a big game update.
* It can intermittently start and stop, sometimes getting out of Google Jail for a few months and then going back in again. It seems to always eventually stop.
* Most of the time, but not always, articles besides the main page are still getting indexed and crawled, and show up with a site: search
* The relevant factor seems to be not the actual “age” of the registration of the domain, but roughly when Google first indexed it
* I can’t find any evidence of this happening before March 2024, in any context even outside of wikis

<div style="text-align: center;">
    <img src="/images/posts/google_jail_hytale_wiki.png" alt="Hytale Wiki on Google" width="600px" />
    <div style="margin-bottom: 1em; font-size: 0.9em; font-style: italic;">
    #1 for the most popular search, and it's the only page on the entire domain that shows up
    </div>
</div>

My best guess (and to be clear, this is a guess): Google decided they could no longer effectively identify and swat away SEO slop, and figured that just massively nerfing brand new domains was their next best option.

## Subdomains of existing domains are totally fine
Since this Google issue started, we’ve also launched a number of wikis on subdomains of an existing, established domain (wiki.leagueoflegends.com, wiki.warframe.com, hypixelskyblock.minecraft.wiki). Every single one of these has been immediately successful for getting articles other than the main page indexed on Google.

It doesn’t even need to be a popular domain! overwatch.weirdgloop.org, which launched just 7 days ago, is already doing better on [page-indexing](https://www.google.com/search?q=overwatch+d-mon) than any of the wikis currently in Google Jail.

## This massively changes the strategy for new wikis
I've always said that the only legitimately *hard* part about moving your wiki off Fandom is that you have to [wage a years-long Google war](https://weirdgloop.org/blog/we-wrote-a-guide#youll-probably-beat-fandom-on-google) against the [zombified corpse](https://www.pcgamer.com/minecraft-wiki-completes-exit-from-fandom-gets-ready-to-fight-its-own-zombified-corpse/) left over on Fandom. When you’ve got the game’s community on your side and you’re not dealing with the new-domain issues, this is genuinely not that hard…

…but when your wiki is simply not able to get its pages to show up because of this Google Jail, that doesn’t matter. You’re not going to get the majority of readers, which to me is what determines the success or failure of a move from Fandom.

So now, when wiki communities come to us asking if we can host them, the conversation about domains is much more complicated than it used to be. We have three basic options:
1. stick with (say) overwatch.wiki - this is the natural place where everyone expects it to be, but it’ll get wrecked on Google
2. try to arrange something with the game studio at (say) wiki.overwatch.com - this is achievable about half of the time, but sometimes
3. put them, at least temporarily, at a subdomain of a domain we already control, that has decent domain authority

None of these are great options, but I hope it makes sense why we’ve been gravitating towards option 3 recently.

From an aesthetic point of view, I genuinely don’t like putting these wikis on weirdgloop.org. At all. I think “Weird Gloop” is an awesome [inside jokey name](https://old.reddit.com/r/2007scape/comments/1tep4em/psa_dont_suggest_dont_engage_with_the_osrs_lore/om81fhp/) for an org that only wiki nerds need to know about (3 separate people have made me bucket-of-weird-gloop plushies over the years!), but a pretty terrible (weird?) name for something that is user-facing and part of a domain that the general public needs to become aware of. It also, on a surface level, makes us look foolish for railing about how [global branding for wiki platforms is super lame](https://weirdgloop.org/blog/why-were-helping-more-wikis-move-away-from-fandom#point-2---global-branding-is-extremely-negative-value-for-wiki-farms) when suddenly we’re doing the same thing everyone else is.

There’s a bit of light at the end of the tunnel, though - based on our experiments so far, it seems like once we establish these new wikis fairly well on Google, it should be safe to move them off weirdgloop.org back to whatever the appropriate name was, while keeping the existing Google juice that the subdomain picked up. I’m hoping that in 6 months or so we can just 301 redirect overwatch.weirdgloop.org to overwatch.wiki, use [Google’s change of address tool](https://support.google.com/webmasters/answer/9370220?hl=en), and put these wikis to where they should have been in the first place.

## Help me figure out what’s going on here
If you’re a wiki person with any sort of data about this phenomenon (or data about moving FROM a subdomain to a new root domain later), please hit me up in the [Weird Gloop discord](https://weirdgloop.org/discord). Honestly, even if you’re just a general SEO person that has an inkling that something massive changed about new domain authority in 2024, let’s figure out what’s really happening.

