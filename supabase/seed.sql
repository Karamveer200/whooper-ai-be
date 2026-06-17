-- TaskForge AI Seed Data
-- Run after schema.sql
-- Idempotent: safe to re-run (uses ON CONFLICT)

-- Businesses (5)
INSERT INTO profiles (id, privy_user_id, wallet_address, role, display_name, avatar_url, bio, trust_score, total_spent) VALUES
('11111111-1111-1111-1111-111111111101', 'privy_biz_1', '0xBiz100000000000000000000000000000000001', 'business', 'NovaScale Labs', 'https://api.dicebear.com/7.x/shapes/svg?seed=novascale', 'AI-native growth studio scaling Web3 brands.', 88, 12400),
('11111111-1111-1111-1111-111111111102', 'privy_biz_2', '0xBiz200000000000000000000000000000000002', 'business', 'Cipher Commerce', 'https://api.dicebear.com/7.x/shapes/svg?seed=cipher', 'On-chain retail infrastructure for modern brands.', 92, 28600),
('11111111-1111-1111-1111-111111111103', 'privy_biz_3', '0xBiz300000000000000000000000000000000003', 'business', 'Arc Protocol', 'https://api.dicebear.com/7.x/shapes/svg?seed=arc', 'DeFi protocol building the future of yield.', 85, 8900),
('11111111-1111-1111-1111-111111111104', 'privy_biz_4', '0xBiz400000000000000000000000000000000004', 'business', 'Pulse Media Co', 'https://api.dicebear.com/7.x/shapes/svg?seed=pulse', 'Crypto-native content and community ops.', 79, 5200),
('11111111-1111-1111-1111-111111111105', 'privy_biz_5', '0xBiz500000000000000000000000000000000005', 'business', 'Vertex DAO', 'https://api.dicebear.com/7.x/shapes/svg?seed=vertex', 'Decentralized product collective.', 94, 45200)
ON CONFLICT (id) DO NOTHING;

-- Workers (10)
INSERT INTO profiles (id, privy_user_id, wallet_address, role, display_name, avatar_url, bio, trust_score, total_earned) VALUES
('22222222-2222-2222-2222-222222222201', 'privy_wrk_1', '0xWrk100000000000000000000000000000000001', 'worker', 'Alex Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'Full-stack dev & smart contract auditor.', 91, 18400),
('22222222-2222-2222-2222-222222222202', 'privy_wrk_2', '0xWrk200000000000000000000000000000000002', 'worker', 'Maya Rivera', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya', 'UI/UX designer specializing in dark interfaces.', 87, 12300),
('22222222-2222-2222-2222-222222222203', 'privy_wrk_3', '0xWrk300000000000000000000000000000000003', 'worker', 'Jordan Kim', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan', 'Content strategist & copywriter.', 83, 7600),
('22222222-2222-2222-2222-222222222204', 'privy_wrk_4', '0xWrk400000000000000000000000000000000004', 'worker', 'Sam Okonkwo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam', 'Data analyst & dashboard builder.', 89, 15200),
('22222222-2222-2222-2222-222222222205', 'privy_wrk_5', '0xWrk500000000000000000000000000000000005', 'worker', 'Elena Volkov', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena', 'Motion designer & video editor.', 86, 9800),
('22222222-2222-2222-2222-222222222206', 'privy_wrk_6', '0xWrk600000000000000000000000000000000006', 'worker', 'Chris Park', 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris', 'Community manager & Discord mod.', 78, 4200),
('22222222-2222-2222-2222-222222222207', 'privy_wrk_7', '0xWrk700000000000000000000000000000000007', 'worker', 'Priya Sharma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', 'Smart contract developer (Solidity/Rust).', 95, 32100),
('22222222-2222-2222-2222-222222222208', 'privy_wrk_8', '0xWrk800000000000000000000000000000000008', 'worker', 'Tyler Brooks', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tyler', 'SEO & growth marketing specialist.', 81, 6100),
('22222222-2222-2222-2222-222222222209', 'privy_wrk_9', '0xWrk900000000000000000000000000000000009', 'worker', 'Nina Andersson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina', 'Technical writer & documentation expert.', 90, 11400),
('22222222-2222-2222-2222-222222222210', 'privy_wrk_10', '0xWrkA0000000000000000000000000000000000A', 'worker', 'Marcus Webb', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', 'QA engineer & test automation.', 84, 8700)
ON CONFLICT (id) DO NOTHING;

-- Tasks (20)
INSERT INTO tasks (id, business_id, title, category, description, acceptance_criteria, payout_amount, token_symbol, chain, status, required_skills, deadline, escrow_tx_hash, assigned_worker_id) VALUES
('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'Build landing page hero section', 'Development', 'Create a responsive hero section for our AI SaaS landing page with animated gradient background and CTA buttons.', '["Mobile responsive","Includes animated gradient","Two CTA buttons","Delivered as React component"]', 450, 'USDC', 'base', 'open', ARRAY['React','Tailwind','Framer Motion'], NOW() + INTERVAL '7 days', NULL, NULL),
('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102', 'Design checkout flow UI', 'Design', 'Design a 3-step checkout flow for crypto payments with wallet connect integration mockups.', '["3-step flow wireframes","Mobile and desktop","Figma source file","Dark theme"]', 680, 'USDC', 'base', 'funded', ARRAY['Figma','UI Design','Web3'], NOW() + INTERVAL '10 days', '0xescrow002abc123def456', NULL),
('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111103', 'Audit ERC-20 token contract', 'Smart Contracts', 'Perform security audit on our new governance token contract. Focus on access control and minting logic.', '["Written audit report","Severity classifications","Remediation suggestions","Max 500 LOC reviewed"]', 2200, 'USDC', 'base', 'accepted', ARRAY['Solidity','Security','Auditing'], NOW() + INTERVAL '14 days', '0xescrow003abc123def456', '22222222-2222-2222-2222-222222222207'),
('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111104', 'Write 10 Twitter threads', 'Content', 'Create 10 engaging Twitter threads about DeFi trends for our brand account.', '["10 threads","Each 8-12 tweets","Include hooks","Brand voice guide followed"]', 350, 'USDC', 'base', 'submitted', ARRAY['Copywriting','Crypto','Social Media'], NOW() + INTERVAL '5 days', '0xescrow004abc123def456', '22222222-2222-2222-2222-222222222203'),
('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111105', 'Build analytics dashboard', 'Development', 'Create a real-time analytics dashboard showing TVL, user count, and transaction volume.', '["Recharts integration","Real-time updates","Responsive layout","Export CSV feature"]', 1200, 'USDC', 'base', 'reviewed', ARRAY['React','Recharts','TypeScript'], NOW() + INTERVAL '21 days', '0xescrow005abc123def456', '22222222-2222-2222-2222-222222222204'),
('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111101', 'Create product demo video', 'Video', 'Produce a 90-second product demo video with motion graphics for our launch.', '["90 seconds","1080p","Motion graphics","Background music included"]', 800, 'USDC', 'base', 'released', ARRAY['After Effects','Motion Design'], NOW() + INTERVAL '12 days', '0xescrow006abc123def456', '22222222-2222-2222-2222-222222222205'),
('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111102', 'Discord community setup', 'Community', 'Set up Discord server with roles, bots, and welcome flow for 5000+ member community.', '["Role hierarchy","Welcome bot","Moderation rules","Channel structure doc"]', 280, 'USDC', 'base', 'open', ARRAY['Discord','Community Management'], NOW() + INTERVAL '7 days', NULL, NULL),
('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111103', 'Write API documentation', 'Documentation', 'Document our REST API with OpenAPI spec, code examples, and authentication guide.', '["OpenAPI 3.0 spec","5 code examples per endpoint","Auth guide","Published to GitBook"]', 550, 'USDC', 'base', 'funded', ARRAY['Technical Writing','API','OpenAPI'], NOW() + INTERVAL '14 days', '0xescrow008abc123def456', NULL),
('33333333-3333-3333-3333-333333333309', '11111111-1111-1111-1111-111111111104', 'SEO audit for DeFi blog', 'Marketing', 'Complete SEO audit with keyword recommendations and content gap analysis.', '["Full audit report","20 keyword targets","Competitor analysis","Action plan"]', 420, 'USDC', 'base', 'open', ARRAY['SEO','Analytics'], NOW() + INTERVAL '10 days', NULL, NULL),
('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111105', 'Smart contract integration tests', 'Smart Contracts', 'Write comprehensive Foundry tests for our staking contract.', '["90%+ coverage","Edge case tests","Gas optimization notes","CI integration"]', 1500, 'USDC', 'base', 'open', ARRAY['Solidity','Foundry','Testing'], NOW() + INTERVAL '14 days', NULL, NULL),
('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111101', 'Brand identity refresh', 'Design', 'Refresh brand identity with new logo variations, color palette, and typography system.', '["Logo suite","Color tokens","Typography scale","Brand guidelines PDF"]', 950, 'USDC', 'base', 'funded', ARRAY['Branding','Figma'], NOW() + INTERVAL '21 days', '0xescrow011abc123def456', NULL),
('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111102', 'E2E test suite for dApp', 'Development', 'Build Playwright E2E tests for wallet connect, swap, and stake flows.', '["Playwright setup","3 critical flows","CI pipeline config","Test report"]', 720, 'USDC', 'base', 'accepted', ARRAY['Playwright','Web3','Testing'], NOW() + INTERVAL '10 days', '0xescrow012abc123def456', '22222222-2222-2222-2222-222222222210'),
('33333333-3333-3333-3333-333333333313', '11111111-1111-1111-1111-111111111103', 'Tokenomics whitepaper', 'Content', 'Write a 15-page tokenomics whitepaper with charts and vesting schedules.', '["15 pages","Vesting charts","Distribution breakdown","Professional tone"]', 1100, 'USDC', 'base', 'open', ARRAY['Copywriting','Tokenomics'], NOW() + INTERVAL '21 days', NULL, NULL),
('33333333-3333-3333-3333-333333333314', '11111111-1111-1111-1111-111111111104', 'Telegram bot for alerts', 'Development', 'Build Telegram bot that sends price alerts and governance vote notifications.', '["Price alerts","Vote notifications","Admin panel","Deployed on Railway"]', 600, 'USDC', 'base', 'disputed', ARRAY['Node.js','Telegram API'], NOW() + INTERVAL '7 days', '0xescrow014abc123def456', '22222222-2222-2222-2222-222222222201'),
('33333333-3333-3333-3333-333333333315', '11111111-1111-1111-1111-111111111105', 'Investor pitch deck', 'Design', 'Design a 12-slide investor pitch deck with data visualizations.', '["12 slides","Data viz","Speaker notes","Keynote and PDF export"]', 850, 'USDC', 'base', 'open', ARRAY['Presentation Design','Data Viz'], NOW() + INTERVAL '14 days', NULL, NULL),
('33333333-3333-3333-3333-333333333316', '11111111-1111-1111-1111-111111111101', 'React component library', 'Development', 'Build 20 reusable React components with Storybook documentation.', '["20 components","Storybook docs","TypeScript","Accessibility tested"]', 1800, 'USDC', 'base', 'open', ARRAY['React','Storybook','TypeScript'], NOW() + INTERVAL '30 days', NULL, NULL),
('33333333-3333-3333-3333-333333333317', '11111111-1111-1111-1111-111111111102', 'Influencer outreach campaign', 'Marketing', 'Identify and outreach to 50 crypto influencers for product launch.', '["50 contacts","Outreach templates","Tracking spreadsheet","5 confirmed partnerships"]', 500, 'USDC', 'base', 'funded', ARRAY['Marketing','Outreach'], NOW() + INTERVAL '14 days', '0xescrow017abc123def456', NULL),
('33333333-3333-3333-3333-333333333318', '11111111-1111-1111-1111-111111111103', 'Subgraph for protocol events', 'Development', 'Deploy The Graph subgraph indexing all protocol events on Base.', '["Subgraph deployed","Event handlers","Query examples","Hosted on Goldsky"]', 900, 'USDC', 'base', 'open', ARRAY['The Graph','Solidity','GraphQL'], NOW() + INTERVAL '14 days', NULL, NULL),
('33333333-3333-3333-3333-333333333319', '11111111-1111-1111-1111-111111111104', 'Newsletter template design', 'Design', 'Design 4 responsive email newsletter templates for weekly digest.', '["4 templates","Mobile responsive","Dark/light variants","HTML export"]', 320, 'USDC', 'base', 'open', ARRAY['Email Design','HTML'], NOW() + INTERVAL '7 days', NULL, NULL),
('33333333-3333-3333-3333-333333333320', '11111111-1111-1111-1111-111111111105', 'Governance forum moderation', 'Community', 'Moderate governance forum for 30 days, enforce guidelines, summarize discussions.', '["Daily moderation","Weekly summary","Guideline enforcement","Escalation report"]', 400, 'USDC', 'base', 'accepted', ARRAY['Community Management','Governance'], NOW() + INTERVAL '30 days', '0xescrow020abc123def456', '22222222-2222-2222-2222-222222222206')
ON CONFLICT (id) DO NOTHING;

-- Submissions (4 — one per task; schema enforces UNIQUE(task_id))
-- Remove superseded revision rows from earlier seed versions
DELETE FROM ai_reviews WHERE id IN (
  '55555555-5555-5555-5555-555555555501',
  '55555555-5555-5555-5555-555555555502',
  '55555555-5555-5555-5555-555555555503',
  '55555555-5555-5555-5555-555555555504'
);
DELETE FROM disputes WHERE submission_id IN (
  '44444444-4444-4444-4444-444444444401',
  '44444444-4444-4444-4444-444444444402',
  '44444444-4444-4444-4444-444444444403',
  '44444444-4444-4444-4444-444444444404'
);
DELETE FROM task_submissions WHERE id IN (
  '44444444-4444-4444-4444-444444444401',
  '44444444-4444-4444-4444-444444444402',
  '44444444-4444-4444-4444-444444444403',
  '44444444-4444-4444-4444-444444444404'
);

INSERT INTO task_submissions (id, task_id, worker_id, submission_text, submission_url, status) VALUES
('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', 'Revision: Added 2 bonus threads and improved hooks per feedback.', NULL, 'submitted'),
('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222204', 'Final dashboard with WebSocket real-time updates and mobile responsive layout.', 'https://dashboard.vertex-dao.app', 'approved'),
('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222205', 'Final cut with client-requested logo placement adjustments.', 'https://vimeo.com/demo-video-final', 'approved'),
('44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333314', '22222222-2222-2222-2222-222222222201', 'Added deployment documentation and Railway config. Bot handles 3 notification types.', NULL, 'disputed')
ON CONFLICT (task_id) DO UPDATE SET
  id = EXCLUDED.id,
  worker_id = EXCLUDED.worker_id,
  submission_text = EXCLUDED.submission_text,
  submission_url = EXCLUDED.submission_url,
  status = EXCLUDED.status;

-- AI Reviews (4 — latest review per submission)
INSERT INTO ai_reviews (id, task_id, submission_id, quality_score, fraud_score, requirements_met, checklist, summary, business_recommendation, suggested_revision_request) VALUES
('55555555-5555-5555-5555-555555555507', '33333333-3333-3333-3333-333333333304', '44444444-4444-4444-4444-444444444405', 88, 6, true, '[{"criterion":"10 threads","met":true,"evidence":"12 threads delivered"},{"criterion":"8-12 tweets each","met":true,"evidence":"Compliant"},{"criterion":"Include hooks","met":true,"evidence":"Improved hooks"},{"criterion":"Brand voice","met":true,"evidence":"All threads on-brand"}]', 'Revision successfully addressed brand voice concerns. Ready for approval.', 'approve', ''),
('55555555-5555-5555-5555-555555555505', '33333333-3333-3333-3333-333333333305', '44444444-4444-4444-4444-444444444406', 96, 2, true, '[{"criterion":"Recharts integration","met":true,"evidence":"Full chart suite"},{"criterion":"Real-time updates","met":true,"evidence":"WebSocket implementation"},{"criterion":"Responsive layout","met":true,"evidence":"Tested on mobile/tablet/desktop"},{"criterion":"CSV export","met":true,"evidence":"Export with date filtering"}]', 'Outstanding final submission exceeding requirements with WebSocket upgrade.', 'approve', ''),
('55555555-5555-5555-5555-555555555506', '33333333-3333-3333-3333-333333333306', '44444444-4444-4444-4444-444444444407', 93, 4, true, '[{"criterion":"90 seconds","met":true,"evidence":"89.8s runtime"},{"criterion":"1080p","met":true,"evidence":"Full HD confirmed"},{"criterion":"Motion graphics","met":true,"evidence":"Polished animations"},{"criterion":"Background music","met":true,"evidence":"Properly licensed"}]', 'Final video with logo adjustments meets all criteria.', 'approve', ''),
('55555555-5555-5555-5555-555555555508', '33333333-3333-3333-3333-333333333314', '44444444-4444-4444-4444-444444444408', 72, 15, false, '[{"criterion":"Price alerts","met":true,"evidence":"Working"},{"criterion":"Vote notifications","met":true,"evidence":"Working"},{"criterion":"Admin panel","met":true,"evidence":"Present"},{"criterion":"Deployed on Railway","met":false,"evidence":"Docs added but live URL not verified"}]', 'Improved submission but deployment verification still pending.', 'request_revision', 'Please provide live Railway deployment URL for verification.')
ON CONFLICT (id) DO NOTHING;

-- Payments
INSERT INTO payments (id, task_id, business_id, worker_id, amount, token_symbol, chain, escrow_tx_hash, release_tx_hash, status) VALUES
('66666666-6666-6666-6666-666666666601', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102', NULL, 680, 'USDC', 'base', '0xescrow002abc123def456', NULL, 'escrowed'),
('66666666-6666-6666-6666-666666666602', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222207', 2200, 'USDC', 'base', '0xescrow003abc123def456', NULL, 'escrowed'),
('66666666-6666-6666-6666-666666666603', '33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222203', 350, 'USDC', 'base', '0xescrow004abc123def456', NULL, 'escrowed'),
('66666666-6666-6666-6666-666666666604', '33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222204', 1200, 'USDC', 'base', '0xescrow005abc123def456', NULL, 'escrowed'),
('66666666-6666-6666-6666-666666666605', '33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222205', 800, 'USDC', 'base', '0xescrow006abc123def456', '0xrelease006abc123def456', 'released'),
('66666666-6666-6666-6666-666666666606', '33333333-3333-3333-3333-333333333314', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222201', 600, 'USDC', 'base', '0xescrow014abc123def456', NULL, 'escrowed')
ON CONFLICT (id) DO NOTHING;

-- Skill Scores
INSERT INTO skill_scores (profile_id, skill, score, completed_tasks_count) VALUES
('22222222-2222-2222-2222-222222222201', 'React', 88, 12),
('22222222-2222-2222-2222-222222222201', 'TypeScript', 85, 10),
('22222222-2222-2222-2222-222222222201', 'Node.js', 82, 8),
('22222222-2222-2222-2222-222222222202', 'Figma', 92, 15),
('22222222-2222-2222-2222-222222222202', 'UI Design', 90, 14),
('22222222-2222-2222-2222-222222222203', 'Copywriting', 86, 9),
('22222222-2222-2222-2222-222222222203', 'Social Media', 84, 7),
('22222222-2222-2222-2222-222222222204', 'Recharts', 94, 6),
('22222222-2222-2222-2222-222222222204', 'TypeScript', 91, 11),
('22222222-2222-2222-2222-222222222205', 'Motion Design', 93, 8),
('22222222-2222-2222-2222-222222222205', 'After Effects', 90, 7),
('22222222-2222-2222-2222-222222222207', 'Solidity', 97, 18),
('22222222-2222-2222-2222-222222222207', 'Security', 95, 12),
('22222222-2222-2222-2222-222222222209', 'Technical Writing', 92, 10),
('22222222-2222-2222-2222-222222222210', 'Playwright', 87, 5)
ON CONFLICT (profile_id, skill) DO NOTHING;

-- Task Events (live feed)
INSERT INTO task_events (task_id, actor_id, event_type, metadata, created_at) VALUES
('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'task_created', '{"title":"Build landing page hero section","payout":450}', NOW() - INTERVAL '2 minutes'),
('33333333-3333-3333-3333-333333333317', '11111111-1111-1111-1111-111111111102', 'task_funded', '{"amount":500,"tx_hash":"0xescrow017abc123def456"}', NOW() - INTERVAL '5 minutes'),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222207', 'task_accepted', '{"worker":"Priya Sharma"}', NOW() - INTERVAL '8 minutes'),
('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222204', 'submission_reviewed', '{"quality_score":96,"recommendation":"approve"}', NOW() - INTERVAL '12 minutes'),
('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111101', 'payment_released', '{"amount":800,"tx_hash":"0xrelease006abc123def456"}', NOW() - INTERVAL '15 minutes'),
('33333333-3333-3333-3333-333333333320', '22222222-2222-2222-2222-222222222206', 'task_accepted', '{"worker":"Chris Park"}', NOW() - INTERVAL '18 minutes'),
('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111105', 'task_created', '{"title":"Smart contract integration tests","payout":1500}', NOW() - INTERVAL '22 minutes'),
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', 'work_submitted', '{"worker":"Jordan Kim"}', NOW() - INTERVAL '25 minutes'),
('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222210', 'task_accepted', '{"worker":"Marcus Webb"}', NOW() - INTERVAL '30 minutes'),
('33333333-3333-3333-3333-333333333314', '11111111-1111-1111-1111-111111111104', 'dispute_opened', '{"reason":"Missing deployment documentation"}', NOW() - INTERVAL '35 minutes'),
('33333333-3333-3333-3333-333333333318', '11111111-1111-1111-1111-111111111103', 'task_created', '{"title":"Subgraph for protocol events","payout":900}', NOW() - INTERVAL '40 minutes'),
('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102', 'task_funded', '{"amount":680,"tx_hash":"0xescrow002abc123def456"}', NOW() - INTERVAL '45 minutes');

-- Disputes
INSERT INTO disputes (id, task_id, submission_id, opened_by, reason, ai_dispute_summary, status) VALUES
('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333314', '44444444-4444-4444-4444-444444444408', '11111111-1111-1111-1111-111111111104', 'Worker failed to provide Railway deployment documentation and live bot URL as required in acceptance criteria.', 'AI analysis indicates the submission meets 75% of requirements. Core bot functionality is present but deployment criterion unmet. Recommend mediation with 48-hour deadline for worker to provide live deployment proof.', 'open')
ON CONFLICT (id) DO UPDATE SET
  submission_id = EXCLUDED.submission_id,
  reason = EXCLUDED.reason,
  ai_dispute_summary = EXCLUDED.ai_dispute_summary,
  status = EXCLUDED.status;
