# 📝 Job Tracker – ระบบติดตามการสมัครงาน

เว็บแอปพลิเคชันสำหรับจดบันทึกและติดตามการสมัครงาน (Job Application Tracking)  
สามารถดูสถานะต่าง ๆ เช่น Applied, Interviewed, Rejected, หรือ Offer Received ได้แบบเรียลไทม์  
ระบบนี้ถูกพัฒนาเพื่อให้ผู้ใช้ไม่พลาดทุกขั้นตอนของกระบวนการสมัครงาน

---

## 📁 โครงสร้างโปรเจกต์

job-tracker-monorepo/
├── frontend/ # Vue 3 + TailwindCSS + DaisyUI (User Interface) /br
├── backend/ # NestJS RESTful API (Business Logic & Database) /br
├── .gitignore /br
├── README.md /br
└── ...

---

## 🚀 ฟีเจอร์หลัก

- ✅ เพิ่ม/แก้ไข/ลบใบสมัครงาน
- 🔍 กรองและเรียงลำดับตามบริษัท, ตำแหน่ง, วันที่สมัคร
- 📅 บันทึกวันสัมภาษณ์และหมายเหตุเพิ่มเติม
- 🛠 เปลี่ยนสถานะใบสมัครได้ เช่น Applied, Interviewed, Rejected
- 💡 มีระบบจัดการสถานะ และจัดกลุ่มได้ตามความต้องการ

---

## 🌐 Tech Stack

| Layer       | Tech Used                                      |
|-------------|------------------------------------------------|
| Frontend    | [Vue 3](https://vuejs.org/) + [TailwindCSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) |
| Backend     | [NestJS](https://nestjs.com/) RESTful API      |
| Database    | PostgreSQL                                     |
| State Mgmt  | Composition API (Vue)                          |
| UI Theme    | Dark/Light Mode via DaisyUI                   |

---

## 🛠 วิธีใช้งาน

### 📦 Clone Repo
```bash
git clone https://github.com/your-username/job-tracker-monorepo.git
cd job-tracker-monorepo

### Frontend
cd frontend
npm install
npm run dev

### Backend
cd ../backend
npm install
npm run start:dev

Created by Tepathip
