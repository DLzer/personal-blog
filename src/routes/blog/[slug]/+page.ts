// src/routes/blog[slug]/+page.ts
import type { PageLoad } from './$types';
import { Marked, marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

export const load: PageLoad = async ({ fetch, params }) => {
    try {
        const slug = params['slug'];
        const res = await fetch(`/${slug}.md`);
        if (res.status !== 200) {
            throw new Error();
        }

        const post = await res.text();

        const marked = new Marked(
            markedHighlight({
                langPrefix: 'hlhjs language-',
                highlight(code, lang) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                }
            })
        )

        return {
            slug,
            post: marked.parse(post),
        };
    } catch (e) {
        throw e;
    }
};