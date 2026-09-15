# Large-Scale 3D MAPF

Anonymous supplementary material. Authors and affiliations are intentionally omitted.

The self-contained website is in `site/`. It includes recorded execution videos,
scene visualizations, and archived single-run metrics. Images and video frames
have not been generated or modified for anonymization.

## Website

After enabling GitHub Pages, the project URL is:

https://guardpibt.github.io/GuardPIBT/

Under **Settings > Pages > Build and deployment**, select **GitHub Actions**.
Run **Publish anonymous website** from the Actions tab if the initial workflow
ran before Pages was enabled. Subsequent pushes to `main` publish automatically.

The deployment uploads only `site/`, not repository metadata or build tooling.
The website has no third-party resource requests or analytics. Search indexing
is discouraged with page metadata, but this is a public site, not access control.

The `_headers` file is supplied for compatible static hosts; GitHub Pages does
not apply it. The HTML referrer policy and Content Security Policy remain present.
