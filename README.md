# Large-Scale 3D MAPF

Anonymous supplementary material. Authors and affiliations are intentionally omitted.

The self-contained website starts at the root `index.html`. It includes recorded execution videos,
scene visualizations, and archived single-run metrics. Images and video frames
have not been generated or modified for anonymization.

## Website

After enabling GitHub Pages, the project URL is:

https://guardpibt.github.io/GuardPIBT/

Under **Settings > Pages > Build and deployment**, use:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

Subsequent pushes to `main` publish automatically. The root `.nojekyll` marker
serves the existing HTML and media without converting this README into a homepage.
There is no separate custom deployment workflow competing with branch publication.

This repository contains only the anonymous website and its publishing notes.
The website has no third-party resource requests or analytics. Search indexing
is discouraged with page metadata, but this is a public site, not access control.

The `_headers` file is supplied for compatible static hosts; GitHub Pages does
not apply it. The HTML referrer policy and Content Security Policy remain present.
