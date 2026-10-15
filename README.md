# Hassan Ali, portfolio

Personal site for Hassan Ali, Senior Software Engineer. Theme: **Inference**. The whole site behaves like a model running.

- **Hero:** a live neural network (three.js) that reacts to the cursor; click it to run a forward pass. The headline is generated token by token (hover a word to see its probability).
- **System prompt:** visitors choose *Hiring manager* or *Client*. Copy, calls to action, services wording and the contact template change to match. Link straight to client mode with `?for=client`.
- **Temperature:** 0.2 shows the concise version of everything, 0.8 the detailed one.
- **Training meter:** scroll progress as a falling loss curve; each section is a checkpoint you can jump to.
- **Sections:** model card (about), evaluation results (impact), training history (experience), selected work with an embedding map and case-study drawer (`#case-relay` links), attention matrix (skills x projects), services and delivery pipeline, "Ask about me" (local retrieval, streamed answers with sources), and a prompt-builder contact form.

Stack: Vite, React 18, TypeScript, three.js, Lenis. Node 24.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to build/
```

## Edit content

Everything visible lives in `src/data/content.ts`: profile, headline, model card, evals, jobs, projects (with concise and detailed text), attention weights, services, pipeline and the Ask answers. Project screenshots are in `src/assets/work/`. The résumé is `public/Hassan-Ali-Resume.pdf`.
