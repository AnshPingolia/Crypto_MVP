# Run the frontend

This guide covers both the sample-data demo and connecting the frontend to a
backend API hosted separately. You do not need the backend folder to use a
hosted API, but you do need its base URL and permission to access it.

## A. Run the frontend with sample data

1. Open this project folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run:

```bash
npm install
```

4. Run:

```bash
npm run dev
```

5. Open the address Vite prints in the terminal. With this project it will normally be:

```text
http://localhost:3000
```

The frontend will use the sample data automatically.

## B. Connect to a backend when you do not have its folder

The frontend cannot start or provide the backend by itself. Ask the person
operating the backend for its reachable API base URL (for example,
`https://api.example.com`). The backend must be running and configured to allow
browser requests from the frontend's origin. `localhost` refers to the
computer running the browser, so use `http://localhost:8000` only when the
backend is running on that same computer. For a backend on another computer,
use the URL or IP address supplied by its operator.

1. Check that the API is reachable by opening `<API_BASE_URL>/` in a browser.
	A healthy API returns JSON similar to `{"status":"ok"}`. You can also
	check `<API_BASE_URL>/docs` if the operator has left the API documentation
	enabled.
2. In the frontend project folder (the folder containing `package.json`),
	create a file named `.env` with the following values. Replace the example
	URL with the base URL supplied by the backend operator; do not add `/docs`
	or an endpoint path at the end.

	```env
	VITE_DATA_SOURCE=backend
	VITE_API_BASE_URL=https://api.example.com
	```

3. Open a terminal in that frontend folder and install dependencies:

	```bash
	npm install
	```

4. Start the frontend:

	```bash
	npm run dev
	```

5. Open the local URL printed by Vite. The app should show cases returned by
	the backend instead of the bundled sample cases. Open a case and run an
	investigation to check the trace endpoint as well.

If the UI still shows sample cases, make sure `VITE_DATA_SOURCE=backend` is in
the frontend `.env` file and restart Vite; Vite reads these values at startup.
If the page reports a network or CORS error, confirm the API URL works from
your computer and ask the backend operator to allow the frontend's origin.
When the frontend is deployed, that origin is its deployed website URL, not
`localhost`. Use HTTPS for both sites when the frontend is served over HTTPS.

For a production build, set these same `VITE_` variables in the frontend
hosting/build environment before running `npm run build`. They are compiled
into the public frontend bundle, so do not put passwords, private keys, or
other secrets in them.

## C. Run the frontend with the current FastAPI backend locally

Use this option only if the backend project is available on this computer.
Start the backend first, then:
1. In the frontend project folder, create a file named `.env` containing:

```env
VITE_DATA_SOURCE=backend
VITE_API_BASE_URL=http://localhost:8000
```

2. In the frontend terminal run:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

Now the frontend will use the backend for case creation and case listing. The existing Case Detail page also loads its case from the backend case list.

## D. Check that the project builds

Run:

```bash
npm run build
```

## Important

The current backend does not provide `GET /cases/{case_id}` and does not return `submitted_at` in its `Case` model. This frontend version handles those two limitations without inventing backend data.
