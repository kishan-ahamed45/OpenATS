## OpenATS - Setup Guide

- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Learning Resources](#learning-resources)
- [Initial Setup](#initial-setup)
  - [Fork and Clone](#1-fork-and-clone)
  - [Add Upstream Remote](#2-add-upstream-remote)
  - [Install pnpm](#3-install-pnpm)
  - [Install Dependencies](#4-install-dependencies)
- [Running the Project](#running-the-project)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Working on a Task](#working-on-a-task)
  - [Before you start ANYTHING](#before-you-start-anything)
  - [Create a new branch for your task](#create-a-new-branch-for-your-task)
  - [Work on your code, then commit](#work-on-your-code-then-commit)
  - [Push your branch](#push-your-branch)
  - [Create Pull Request on GitHub](#create-pull-request-on-github)
- [Important Rules](#important-rules)

## Prerequisites

Before you start, make sure you have these installed:

- Node.js (version 18 or higher) - [Download here](https://nodejs.org/)
- Git - [Download here](https://git-scm.com/)
- PostgreSQL - [Download here](https://www.postgresql.org/download/)
- A code editor (VS Code recommended)

Check if you have them:

```bash
node --version
git --version
psql --version
```

## Tech Stack

**Frontend (web)**

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend (api)**

- Express.js
- TypeScript
- Node.js
- PostgreSQL (Database)
- WSO2 Asgardeo (Authentication)

**Package Manager:** pnpm

## Learning Resources

If you're new to any of these technologies, watch these videos or follow the official documentations ( google it you can find them)

**Git & GitHub:**
**Git & GitHub:**

- [Workshop on Navigating Version Control - UOM CSE Department](https://www.youtube.com/watch?v=RGOj5yH7evk)

**React & Next.js:**

- [React Tutorial for Beginners](https://youtu.be/SqcY0GlETPk?si=_XC8zvGJUjVEVV0h)
- [React Tutorial for Beginners](https://youtu.be/ZVnjOPwW4ZA?si=wd4Cib8OAEqOXpk-)

**TypeScript:**

- [TypeScript Crash Course](https://www.youtube.com/watch?v=BCg4U1FzODs)

**Express.js:**

- [Express.js & Node.js Course](https://www.youtube.com/watch?v=Oe421EPjeBE)
- [Building REST APIs with Express](https://www.youtube.com/watch?v=pKd0Rpw7O48)

**PostgreSQL:**

- [PostgreSQL Tutorial for Beginners](https://www.youtube.com/watch?v=qw--VYLpxG4)

**WSO2 Asgardeo:**

- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)

## Initial Setup

### 1. Fork and Clone

Fork the repository on GitHub first, then:

```bash
git clone https://github.com/chamals3n4/OpenATS.git
cd OpenATS
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/chamals3n4/OpenATS.git
git remote -v  # verify you have both origin and upstream
```

### 3. Install pnpm

```bash
npm install -g pnpm
```

### 4. Install Dependencies

Frontend:

```bash
cd apps/web
pnpm install
```

Backend:

```bash
cd apps/api
pnpm install
```

## Running the Project

### Frontend

```bash
cd apps/web
pnpm dev
```

Open `http://localhost:3000`

### Backend

```bash
cd apps/api
pnpm dev
```

Open `http://localhost:8080`

Run both in separate terminals.

## Working on a Task

### Before you start ANYTHING:

```bash
git checkout main
git pull upstream main
git push origin main
```

### Create a new branch for your task:

```bash
git checkout -b feature/task-name
# or
git checkout -b fix/bug-name
```

### Work on your code, then commit:

```bash
git add .
git commit -m "brief description of what you did"
```

### Push your branch:

```bash
git push origin feature/task-name
```

### Create Pull Request on GitHub

Go to GitHub and create a PR from your branch to the main repository.

## Important Rules

- NEVER push directly to main
- ALWAYS pull from upstream before starting work
- Create a NEW branch for each task
- Keep commits small and focused
- Test your code before pushing
