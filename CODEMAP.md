# CODEMAP · Schale Report (index.html)

Bản đồ code: muốn sửa gì thì tìm (Ctrl+F) đúng **từ khoá** ở cột phải, không cần dò cả file.
Từ khoá là dòng tiêu đề `=====` hoặc tên biến có sẵn trong code, nên thêm/bớt dòng cũng không làm file này sai.
Số dòng chính xác của bản hiện tại: chạy `make_map.ps1` → mở `CODEMAP_lines.md`.

File gồm 3 phần theo thứ tự: **CSS nhỏ** (`<style>` trong `<head>`) → **HTML các màn** → **CSS lớn** (`<style>` thứ hai) → **JavaScript** (5 khối `<script>` ở cuối).
Quy tắc: khối CSS viết **sau** thắng khối viết trước, nên các khối "hệ thống" (nút, sheet, sảnh điện thoại) nằm cuối CSS.

---

## 1. Màn hình (HTML) · tìm `id="..."`

| Màn | Từ khoá | Ghi chú |
|---|---|---|
| Thanh trên cùng | `id="topbar"` | logo, tiêu đề, nút ?, ô số liệu, sáng/tối, nút nhà |
| Dock điện thoại | `id="dock"` | 5 nút dưới cùng |
| Sảnh + các ô | `id="home"` | ô: `tRaid` `tBan` `tPvp` `tStu` `tUe` `tBoss` `tOrd` (Thẻ EX) `tTask` `tSrv` (Roster) `tLock` (JFD) |
| TA / GA | `id="s-raid"` | |
| Banner | `id="s-banner"` | |
| PvP | `id="s-pvp"` | |
| Kế hoạch UE | `id="s-ue"` | |
| Nhiệm vụ | `id="s-task"` | |
| Học sinh (Tier list) + Nguồn + footer | `id="s-stu"` | bộ lọc `id="sfil"`, tab `id="ttabs"`, nguồn `id="sources"` |
| Roster của tôi | `id="s-roster"` | |
| Cơ chế boss · Thẻ EX | `id="s-boss"` | Thẻ EX = `id="order"` |
| Joint Firing Drill | `id="s-jfd"` | |
| Popup học sinh (sheet) | `id="gm"` | tab `id="gtabs"` |
| Popup "?" | `id="hpop"` | nội dung ở JS `const HELP={` |

## 2. Giao diện (CSS) · tìm tiêu đề khối

| Muốn sửa | Từ khoá |
|---|---|
| Bảng, chip, tag cơ bản | `/* TABLES */` · `/* CHIPS & TAGS */` |
| Thẻ TA/GA, PvP, banner (bản gốc) | `/* LIVE TRACKER */` · `/* TA/GA + BANNERS side by side */` |
| Trang boss | `/* BOSS PAGER` |
| Tier list (khung tier) | `/* TIER */` |
| Viền focus bàn phím, độ tương phản | `===== ACCESSIBILITY: contrast` |
| Nút ≥44px trên điện thoại | `===== PHONE: 44px touch targets` |
| Icon đạn / giáp / vai trò / vị trí | `===== GAME ICONS for ammo` |
| Máy tính Eligma / Pyroxene | `===== ELIGMA / PYROXENE CALCULATOR` |
| Màu giao diện tối (Plana) | `===== PLANA DARK THEME` |
| Thanh trên, ô sảnh cơ bản, thẻ học sinh | `===== GAME UI: top bar` |
| Dáng nghiêng -12° của nút/tab, màu navy/vàng | `===== BA DESIGN LANGUAGE` |
| Màn Nhiệm vụ (thẻ việc, nút ✓) | `===== NHIỆM VỤ (Tasks screen` · `.tk{` |
| Ảnh nền từng màn | `#s-boss.screen{` · `#s-stu.screen` · `#s-raid.screen` |
| Hiệu ứng mở / đóng màn (zoom) | `===== Apple-style open / close` |
| Dock điện thoại, vuốt quay lại | `===== phone Dock` |
| Bố cục điện thoại (dải học sinh, ảnh phòng) | `===== PHONE LAYOUT (≤900px), one block` |
| Kính Apple của các khung | `===== LIQUID GLASS` |
| Chống tràn trên điện thoại | `===== PHONE ANTI-CUT` |
| Cỡ chữ / khoảng cách / bo góc chung | `UI v2 · design system` |
| Kiểu tiêu đề mục (vạch cyan nghiêng) | `.sec-head h2::before` |
| Icon thay emoji (cỡ, bóng) | `===== game icons (Icons/<key>.png` |
| Nút sáng/tối (mặt trăng/mặt trời) | `#thm{` |
| Popup học sinh dạng sheet (kéo, 2 nấc) | `===== student profile BOTTOM SHEET` |
| Ô sảnh nghiêng, kính mờ, bong bóng trạng thái | `===== LOBBY TILES: Skewed Card` |
| Ô Joint Firing Drill + màn JFD | `===== Joint Firing Drill guide (#s-jfd)` |
| Lưới sảnh máy tính (vị trí từng ô) | `12 equal columns, one gap` |
| Thu gọn thành icon khi chật (desktop) | `===== AUTO-COMPACT (desktop, JS adds .cmp` |
| Popup học sinh kính + tab | `===== STUDENT SHEET · glass` |
| **Mọi nút & tab** (40px, 2 trạng thái, Xóa lọc đỏ) | `===== BUTTONS & TABS · one system` |
| Màn Roster (hàng học sinh) | `===== ROSTER screen: one glass row` |
| Ảnh phòng trên ô Banner / PvP / UE | `#home #tBan{--room` |
| Sảnh điện thoại (dải ngang + ô nhỏ) | `===== LOBBY · PHONE BENTO` |

## 3. Dữ liệu (JS) · tìm tên biến

| Dữ liệu | Từ khoá |
|---|---|
| Roster theo tier + mốc UE mặc định | `const SSP=` · `const SS=` · `const S=` · `const A=` · `const BC=` |
| Sửa roster đã lưu (có/chưa có, sao, Lv, skill) | `roster edits from the Roster screen` (`RST`, `RALL`, `rget`) |
| Mốc UE đã lưu | `const UEX=` · `const saveRoster=` |
| Vai trò / đạn / giáp / Striker-Special | `const STAT={}` |
| Vị trí Front/Middle/Back | `battle position (Blue Archive Wiki` |
| Tiểu sử học sinh | `const BIO={}` |
| Hệ đạn (Explosive…Corrosive) | `const TYPE=` |
| Học sinh đang có | `const OWN={}` |
| Boss: cơ chế, đội, thẻ mở đầu | `const BOSSES3=` · `const BOSS_KEYS=` |
| Giáp boss | `const AR={` |
| Lịch banner + đánh giá quay | `.map(b=>({...b,S:new Date(b.s)` (dữ liệu ngay trên) · `const VD=` |
| Lịch Joint Firing Drill | `===== Joint Firing Drill schedule` |
| Địa hình JFD từng học sinh | `const JTR={}` |
| Kiểu đề / thưởng JFD | `const JTYPE=` · `const JRW=` |
| Ảnh nền ô sảnh | `const LBG=` |
| Học sinh trực + câu chào từng màn | `const CAST=` |
| Thoại sảnh (Hina, Arona, Plana) | `const L2D=` |
| Thoại Rin, Aoi, Ayumu, Sora, Momoka… | `===== Talk screens` · `stageTalk({` |
| Hướng dẫn nút "?" | `const HELP={` |
| Emoji → icon | `const MAP={` |
| Khung mặt boss trên ô sảnh | `const BFACE=` |

## 4. Chức năng (JS) · tìm tiêu đề

| Chức năng | Từ khoá |
|---|---|
| Ưu tiên âm thanh giữa các màn | `===== sound priority` |
| Vẽ Tier list (thẻ, chip, lưới) | `function gridCards` · `function cards(` |
| Popup học sinh: mở, nội dung, tab | `function openStu` · `function stuInfo` · `function uePick` · `function growBody` |
| Lọc học sinh (vai trò, đạn, giáp…) | `// search + filters (role` |
| **Màn Roster** (sửa, lưu, xuất/nhập file) | `===== ROSTER screen (#roster)` |
| Số liệu trang đầu + "điểm dừng" theo roster | `===== metrics + stop lanes` |
| Banner: vẽ tuần, chọn tuần | `function renderBan` · `function curBan` |
| Máy tính Eligma / kế hoạch UE | `===== Eligma plan` · `function planFor` · `function renderCalc` |
| Nhiệm vụ: danh sách, tích, hoàn thành hết | `===== Nhiệm vụ (replaces MomoTalk)` · `function taskList` · `function renderTasks` |
| Đổi sáng / tối | `===== theme toggle` |
| Biến tên học sinh trong chữ thành link | `===== make student names in plain text clickable` |
| Chuyển màn (hash), zoom mở/đóng màn | `===== game shell` · `function route()` · `function zoomScr` |
| Số liệu trên sảnh + thanh trên | `function fillShell` |
| Ô JFD trên sảnh / màn JFD | `===== Joint Firing Drill card on the lobby` · `===== Joint Firing Drill guide screen` |
| Học sinh chạm được ở sảnh (xoa đầu, chọc má) | `===== lobby student you can touch` |
| Nhân vật Spine (Arona/Plana ngày đêm, nạp file) | `===== Spine (real in-game rig)` |
| Popup "?" | `"?" next to the screen title` |
| Nút ẩn ô sảnh để ngắm học sinh | `lobby HUD hide` |
| Căn mép nghiêng các ô sảnh | `every card leans around its own middle` |
| Vuốt mép để quay lại (điện thoại) | `===== swipe back` |
| Sheet học sinh: kéo, 2 nấc, đóng | `===== student profile = iOS-style BOTTOM SHEET` |
| Thay emoji bằng icon | `===== game icons instead of emoji` |
| Thu gọn thành icon khi chật | `===== AUTO-COMPACT (desktop ≥901px)` |
| Bàn phím, trình đọc màn hình | `===== ACCESSIBILITY (keyboard` |
| Đặt mặt boss vào ô sảnh | `===== BOSS FACE BOXES` · `function fit(img)` |

## 5. Lưu trên trình duyệt (localStorage)

| Khoá | Nội dung | Ghi ở |
|---|---|---|
| `ba_ue` | mốc UE đã sửa | popup, Nhiệm vụ, Roster |
| `ba_roster` | có/chưa có, sao, Lv, skill (chỉ phần khác mặc định) | Roster |
| `ba_theme` | sáng / tối | nút sáng/tối |
| (nhiệm vụ đã tích) | xem `tkGet` | Nhiệm vụ |

## 6. Thư mục ảnh

`Icons/` icon (rp-* bộ RidhonPota, st-* trạng thái game, atk/def/role/pos dữ liệu) · `BG/` ảnh nền phòng · `Avatar_Collection/` avatar · `Portrait_Full/` chân dung · `BlueArchive_TA_GA_Bosses_HD/` boss · `Spine/` nhân vật động + thoại.
