

# pollingexpress

pollingexpress is a node.js/express/angular application to do interactive, real-time polls. It's main use case are events and meetings wher you want to quickly set up questions for the audience that can be answered in real-time.
All that is needed to participate in polls is a browser, and the application works well on mobile browsers.

pollingexpress is a work in progress, but has been successfully used at an event with about 40 people, but many features are still missing.

One goal of this development was to have absolutely minimal dependencies with respect to toolchain installation, and the application can indeed be built as soon as node and npm are available on a system. (The use of connect-gzip-static adds a few dependencies, but use of this is actually optional, it's mainly an optimization to save bandwith for the mobile clients).

Feel free to use and improve it.

## Usage

To build and run pollingexpress you need

*   Node.js v6.9.4
*   npm v3.10.10
*   webpack 1.14.0
*	bower v1.8.8

To build: 
	npm run fullbuild
	
To start:
	npm start

You may set the environment variable `POLLINGEXPRESS_PORT` to the port you want the application to listen on

To see the voting application, navigate to

	http://localhost:43210

The administration gui to add and edit polls, monitor users and show polling results is found under  

	http://localhost:43210/#!/admin/


