-- Users Table
CREATE TABLE IF NOT EXISTS sz_tch_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- In real app, use bcrypt. Here simple hash for demo.
    role TEXT NOT NULL CHECK(role IN ('ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER')),
    full_name TEXT NOT NULL,
    dept TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System Configs (Feature Flags)
CREATE TABLE IF NOT EXISTS sz_tch_system_configs (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT
);

-- Teacher Profiles (The Core Entity)
CREATE TABLE IF NOT EXISTS sz_tch_teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dept TEXT NOT NULL,
    title TEXT, -- e.g., Professor, Lecturer
    hire_date DATE,
    status TEXT DEFAULT 'Active',
    growth_score REAL DEFAULT 0.0, -- Calculated score
    risk_level TEXT DEFAULT 'LOW' CHECK(risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Archive Documents
CREATE TABLE IF NOT EXISTS sz_tch_archives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER,
    category TEXT NOT NULL, -- e.g., 'Teaching', 'Research', 'Awards'
    doc_title TEXT NOT NULL,
    doc_type TEXT, -- PDF, Image, Excel
    file_url TEXT, -- Simulated path
    upload_date DATE DEFAULT CURRENT_DATE,
    verified_by INTEGER, -- HR Admin ID
    FOREIGN KEY(teacher_id) REFERENCES sz_tch_teachers(id) ON DELETE CASCADE
);

-- Risk Warnings
CREATE TABLE IF NOT EXISTS sz_tch_warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER,
    warning_type TEXT NOT NULL, -- 'Teaching Accident', 'Grant Overdue'
    severity TEXT NOT NULL CHECK(severity IN ('Info', 'Warning', 'Critical')),
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(teacher_id) REFERENCES sz_tch_teachers(id) ON DELETE CASCADE
);

-- Seed Data
INSERT INTO sz_tch_users (username, password_hash, role, full_name, dept) VALUES
('admin', 'admin123', 'ADMIN', '系统管理员', '信息中心'),
('hr_manager', 'hr123', 'HR_MGR', '张主管', '人事处'),
('teacher01', 'tch123', 'TEACHER', '李明教授', '计算机学院'),
('decider', 'dec123', 'DECIDER', '王副校长', '校级领导');

INSERT INTO sz_tch_system_configs (key, value, description) VALUES
('maintenance_mode', 'false', '系统维护模式开关'),
('data_sync_interval', '3600', '数据同步间隔(秒)'),
('max_upload_size_mb', '50', '最大上传文件大小(MB)');

INSERT INTO sz_tch_teachers (emp_id, name, dept, title, hire_date, status, growth_score, risk_level) VALUES
('T2026001', '李明', '计算机学院', '教授', '2010-09-01', 'Active', 88.5, 'LOW'),
('T2026002', '王芳', '计算机学院', '副教授', '2015-07-15', 'Active', 75.2, 'MEDIUM'),
('T2026003', '张伟', '电子工程学院', '讲师', '2022-09-01', 'Active', 60.0, 'LOW'),
('T2026004', '赵丽', '基础教学部', '教授', '2008-03-10', 'Active', 92.1, 'HIGH');

INSERT INTO sz_tch_archives (teacher_id, category, doc_title, doc_type, file_url) VALUES
(1, 'Research', '2025年度国家自然科学基金项目书', 'PDF', '/assets/docs/grant_2025.pdf'),
(1, 'Teaching', '2024-2025学年第一学期教学评价报告', 'PDF', '/assets/docs/eval_2024.pdf'),
(2, 'Awards', '校级优秀青年教师奖证书', 'Image', '/assets/docs/award_yth.jpg'),
(3, 'Training', '新教师岗前培训结业证书', 'PDF', '/assets/docs/training_cert.pdf');

INSERT INTO sz_tch_warnings (teacher_id, warning_type, severity, message) VALUES
(2, 'Grant Overdue', 'Warning', '国家自然科学基金项目即将到期，请提前准备结题材料。'),
(4, 'Teaching Accident', 'Critical', '2025年春季学期发生教学事故一次，请人事处关注。'),
(1, 'Certification Expiry', 'Info', '高校教师资格证将于2026年底到期，请及时申请认定。');
