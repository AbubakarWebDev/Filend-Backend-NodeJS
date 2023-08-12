# Filend-Backend-NodeJS

Welcome to the Filend-Backend-NodeJS repository!
Our backend solutions seamlessly integrate with Filend's real-time file sharing, Chat Me Up's instant messaging, and Meet Me Up's high-quality video conferencing. Powered by advanced technologies, our backend ensures smooth communication experiences across all three applications. Join us in exploring these innovative backend functionalities that enhance your communication capabilities.

Get started with these cutting-edge applications and enhance your communication experience today!


## Related Repositories
- [Filend Frontend ReactJS](https://github.com/AbubakarWebDev/Filend-Frontend-ReactJS): This repository holds the frontend code contains the WebRTC file sharing application, chat application, and video meeting application. For a complete understanding and to see our WebRTC implementation in action, be sure to check out the frontend repo as well.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

You'll need [Git](https://git-scm.com), and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

```
node@18.13.0 or higher
npm@9.2.0 or higher
git@2.39.0 or higher
```

## Clone the repo

```shell
git clone https://github.com/AbubakarWebDev/Filend-Backend-NodeJS.git
cd Filend-Backend-NodeJS
```

## Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
npm run dev
```


## Setting Up Environment Variables

To run the applications smoothly, you'll need to set up environment variables. Here's how you can do it:

1. Locate the `.env.example` files in the application root directory

2. Duplicate the `.env.example` file and rename the duplicate to `.env`.

3. Open the newly created `.env` file in a text editor of your choice.

4. Customize the environment variables according to your requirements and environment. These variables may include API keys, database connection strings, and other configuration settings needed for the applications to function correctly.

5. Save the `.env` file after making your changes.

Please ensure that you **do not** commit your `.env` files to version control, as they may contain sensitive information. Make sure to add `.env` to your `.gitignore` file to prevent accidental commits.

By customizing your `.env` files, you can configure the applications to work with your specific environment, enabling seamless operation.


## Contribution

Please feel free to contribute to this open-source project, report issues, and suggest improvements. Let's make file sharing smarter and more convenient together!


## License

This project is licensed under the [MIT License](LICENSE).