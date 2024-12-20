import type { Response } from "express"

// @desc Static options for express static middleware
export const staticOptions = {
	dotfiles: "ignore",
	etag: true,
	extensions: ["jpg", "jpeg", "png"],
	index: false,
	maxAge: "7d",
	redirect: false,
	setHeaders: (res: Response, path: string, stat: any) => {
		res.set("X-Timestamp", Date.now().toString())
	},
}

// dotfiles: allow | deny | ignore - (default: ignore)
// etag: true | false - Informs browser the file version (default: true)
// extensions: ["png", "jpg"] - If file is not found, try these extensions (default: false)
// index: "someFile.html" | false, // Disable directory indexing and searchs for specific file (default: false)
// maxAge: "7d", // Cache-Control header value in ms or string (default: 0)
// redirect: false, // Redirects to root if file is not found (default: false)
// setHeaders: (res, path, stat) => { // Function to set custom headers (default: undefined)}
