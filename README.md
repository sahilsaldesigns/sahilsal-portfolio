This is a [Tina CMS](https://tina.io/) project.

## Local Development

Install the project's dependencies:

> [!NOTE]  
> [Do you know the best package manager for Node.js?](https://www.ssw.com.au/rules/best-package-manager-for-node/) Using the right package manager can greatly enhance your development workflow. We recommend using pnpm for its speed and efficient handling of dependencies. Learn more about why pnpm might be the best choice for your projects by checking out this rule from SSW.

```
pnpm install
```

Run the project locally:

```
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building the Starter Locally (Using the hosted content API)

Replace the `.env.example`, with `.env`

```
NEXT_PUBLIC_TINA_CLIENT_ID=<get this from the project you create at app.tina.io>
TINA_TOKEN=<get this from the project you create at app.tina.io>
NEXT_PUBLIC_TINA_BRANCH=<Specify the branch with Tina configured>
```

Build the project:

```bash
pnpm build
```

## Learn More

To learn more about Tina, take a look at the following resources:

- [Tina Docs](https://tina.io/docs)
- [Getting started](https://tina.io/docs/setup-overview/)

## Tina Blocks (Custom components)

This project exposes UI components as Tina "blocks" so editors can add them from the Tina admin.

- Available block templates: `Card Slider` (`card_slider`) and `Photo Stack` (`photo_stack`).
- To add a block, edit a page in Tina Admin and add a block under the `Blocks` field. Each block has the appropriate fields (e.g. cards or images).
- Example frontmatter for `content/page/home.mdx` is included showing how to add both block types.

If you add new components, register a corresponding block template in `tina/collections/page.js` and map it in `app/components/layout/BlockRenderer.tsx`.

You can check out [Tina Github repository](https://github.com/tinacms/tinacms) - your feedback and contributions are welcome!

## [Deploy on Vercel](https://tina.io/guides/tina-cloud/add-tinacms-to-existing-site/deployment/)
