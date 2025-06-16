A simple Node.js mailing project using Amazon SES for:

Warm-up: send test emails to a “Warmup” list

Outreach: send initial sales emails to a prospect list

Follow-up: send follow-up emails to prospects marked “needed”

📋 Prerequisites

Node.js v14+ & npm

An AWS account with SES:

Domain (iqventoryllc.com) and Mail-From (outreach.iqventoryllc.com) verified

Production access (or sandbox with verified recipients)

AWS Access Key & Secret for an IAM user with AmazonSESFullAccess

⚙️ Installation

Clone or copy this repo:

git clone https://github.com/YOUR_USERNAME/my-ses-mailer.git
cd my-ses-mailer

Install dependencies:

npm install

Create a .env file in the root:

AWS_KEY=AKIA...YOURACCESSKEY
AWS_SECRET=...YOURSECRETKEY
AWS_REGION=us-east-2
FROM_ADDRESS=outreach@iqventoryllc.com

Ensure contacts.xlsx is in the project root (see below).

📑 Excel Workbook: contacts.xlsx

This file must have two worksheets:

1. Warmup

Column

Header

Description

A

Name

Test recipient name

B

Email

Test recipient email address

C

Status

not yet → sent on success

2. Outreach

Column

Header

Description

A

Name

Prospect’s name

B

Email

Prospect’s email address

C

Status

not yet → sent after initial outreach

D

NumSent

Number of emails sent (initial + follow-up)

E

Niche

(Optional) Prospect’s industry or niche

F

Contactor

Your name (e.g. Lucas Aust)

G

Role

Your role/title (e.g. Founder, COO)

H

FollowUp

Blank → needed after initial outreach → yes after follow-up

Populate each sheet with not yet for rows you want processed.

🚀 Usage

Three npm scripts are provided:

Command

Description

npm run warmup

Send test emails to all rows in Warmup with status not yet.

npm run outreach

Send initial sales emails to Outreach where status = not yet, update status, NumSent, FollowUp.

npm run followup

Send follow-up to Outreach where FollowUp = needed, update NumSent and set FollowUp = yes.

Example:

npm run warmup
npm run outreach
npm run followup

🛠️ How It Works

ExcelJS reads/writes contacts.xlsx in-place.

Nodemailer + AWS SDK transports mail via SES.

Each script throttles between sends (2–3s) to avoid rate limits.

Status columns prevent duplicate sends on subsequent runs.

🤝 Contributing

Fork this repository

Create a feature branch (git checkout -b feature/foo)

Commit your changes (git commit -m 'feat: add foo')

Push to the branch (git push origin feature/foo)

Open a Pull Request

📄 License

MIT

