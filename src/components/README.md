# PhoneInput Component

Component PhoneInput có thể tái sử dụng được tạo ra để thay thế việc sử dụng `react-phone-input-2` trực tiếp trong các trang.

## Tính năng

- ✅ **2 ô input riêng biệt**: Ô chọn quốc gia và ô nhập số điện thoại
- ✅ **Hiển thị cờ quốc gia**: Cờ quốc gia hiển thị rõ ràng với nhiều phương pháp fallback
- ✅ **Hiển thị mã quốc gia rõ ràng**: Mã quốc gia hiển thị giữa cờ và icon dropdown
- ✅ **Validation tự động**: Kiểm tra format số điện thoại theo chuẩn quốc tế
- ✅ **Logic submit tối ưu**: Xử lý phone number đúng cách với mã quốc gia
- ✅ Dropdown chọn quốc gia với danh sách đầy đủ
- ✅ Tự động định dạng số điện thoại
- ✅ Validation và error handling
- ✅ Responsive design
- ✅ Tùy chỉnh giao diện dễ dàng

## Thiết kế

Component được thiết kế với **2 ô riêng biệt** như trong thiết kế chuẩn:

1. **Ô chọn quốc gia** (bên trái):
   - **Hiển thị cờ quốc gia** với 3 phương pháp fallback:
     - Thư viện `country-flag-icons` (ưu tiên cao nhất)
     - Emoji flags (🇸🇬, 🇻🇳, 🇨🇳, 🇺🇸, 🇬🇧, 🇦🇺, 🇨🇦)
     - CSS flags (fallback cuối cùng)
   - **Hiển thị mã quốc gia** (VD: +86) ở giữa cờ và icon dropdown
   - Icon dropdown arrow có animation
   - Kích thước cố định: 120px (desktop), 100px (mobile)

2. **Ô nhập số điện thoại** (bên phải):
   - Input để nhập số điện thoại
   - Chiếm phần còn lại của container
   - Placeholder mặc định: "123-456-789"

## Cách sử dụng

### Basic Usage
```tsx
import PhoneInput from '../components/PhoneInput';

<PhoneInput
  value={phone}
  onChange={setPhone}
  country="sg"
  placeholder="Enter phone number"
  required
/>
```

### Với validation
```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  country="sg"
  error={errors.phone}
  required
  label="Contact Number"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Giá trị số điện thoại (bao gồm mã quốc gia) |
| `onChange` | `(value: string) => void` | - | Callback khi giá trị thay đổi |
| `country` | `string` | `'sg'` | Mã quốc gia mặc định |
| `placeholder` | `string` | `'123-456-789'` | Placeholder cho input số điện thoại |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `required` | `boolean` | `false` | Hiển thị dấu * cho trường bắt buộc |
| `error` | `string` | - | Thông báo lỗi |
| `className` | `string` | `''` | CSS class cho container |
| `label` | `string` | - | Label cho input |
| `labelClassName` | `string` | - | CSS class cho label |
| `onBlur` | `() => void` | - | Callback khi blur |
| `onFocus` | `() => void` | - | Callback khi focus |

## Quốc gia được hỗ trợ

Component hỗ trợ **hơn 100 quốc gia** với **cờ và mã quốc gia khớp nhau chính xác**:

### Châu Á
- **Singapore (SG)** 🇸🇬 - Mã: +65 (Mặc định)
- **Vietnam (VN)** 🇻🇳 - Mã: +84
- **China (CN)** 🇨🇳 - Mã: +86
- **Japan (JP)** 🇯🇵 - Mã: +81
- **South Korea (KR)** 🇰🇷 - Mã: +82
- **Thailand (TH)** 🇹🇭 - Mã: +66
- **Malaysia (MY)** 🇲🇾 - Mã: +60
- **Indonesia (ID)** 🇮🇩 - Mã: +62
- **Philippines (PH)** 🇵🇭 - Mã: +63
- **India (IN)** 🇮🇳 - Mã: +91
- **Cambodia (KH)** 🇰🇭 - Mã: +855
- **Laos (LA)** 🇱🇦 - Mã: +856
- **Myanmar (MM)** 🇲🇲 - Mã: +95
- **Nepal (NP)** 🇳🇵 - Mã: +977
- **Sri Lanka (LK)** 🇱🇰 - Mã: +94
- **Bangladesh (BD)** 🇧🇩 - Mã: +880
- **Pakistan (PK)** 🇵🇰 - Mã: +92
- **Iran (IR)** 🇮🇷 - Mã: +98
- **Iraq (IQ)** 🇮🇶 - Mã: +964
- **Syria (SY)** 🇸🇾 - Mã: +963
- **Lebanon (LB)** 🇱🇧 - Mã: +961
- **Jordan (JO)** 🇯🇴 - Mã: +962
- **Oman (OM)** 🇴🇲 - Mã: +968
- **Bahrain (BH)** 🇧🇭 - Mã: +973
- **Kuwait (KW)** 🇰🇼 - Mã: +965
- **Qatar (QA)** 🇶🇦 - Mã: +974
- **United Arab Emirates (AE)** 🇦🇪 - Mã: +971
- **Saudi Arabia (SA)** 🇸🇦 - Mã: +966
- **Israel (IL)** 🇮🇱 - Mã: +972
- **Turkey (TR)** 🇹🇷 - Mã: +90
- **Afghanistan (AF)** 🇦🇫 - Mã: +93
- **Kazakhstan (KZ)** 🇰🇿 - Mã: +7
- **Uzbekistan (UZ)** 🇺🇿 - Mã: +998
- **Kyrgyzstan (KG)** 🇰🇬 - Mã: +996
- **Tajikistan (TJ)** 🇹🇯 - Mã: +992
- **Turkmenistan (TM)** 🇹🇲 - Mã: +993
- **Mongolia (MN)** 🇲🇳 - Mã: +976
- **Georgia (GE)** 🇬🇪 - Mã: +995
- **Armenia (AM)** 🇦🇲 - Mã: +374
- **Azerbaijan (AZ)** 🇦🇿 - Mã: +994

### Châu Âu
- **United Kingdom (GB)** 🇬🇧 - Mã: +44
- **Germany (DE)** 🇩🇪 - Mã: +49
- **France (FR)** 🇫🇷 - Mã: +33
- **Italy (IT)** 🇮🇹 - Mã: +39
- **Spain (ES)** 🇪🇸 - Mã: +34
- **Netherlands (NL)** 🇳🇱 - Mã: +31
- **Belgium (BE)** 🇧🇪 - Mã: +32
- **Switzerland (CH)** 🇨🇭 - Mã: +41
- **Austria (AT)** 🇦🇹 - Mã: +43
- **Sweden (SE)** 🇸🇪 - Mã: +46
- **Norway (NO)** 🇳🇴 - Mã: +47
- **Denmark (DK)** 🇩🇰 - Mã: +45
- **Finland (FI)** 🇫🇮 - Mã: +358
- **Poland (PL)** 🇵🇱 - Mã: +48
- **Czech Republic (CZ)** 🇨🇿 - Mã: +420
- **Hungary (HU)** 🇭🇺 - Mã: +36
- **Romania (RO)** 🇷🇴 - Mã: +40
- **Bulgaria (BG)** 🇧🇬 - Mã: +359
- **Croatia (HR)** 🇭🇷 - Mã: +385
- **Slovenia (SI)** 🇸🇮 - Mã: +386
- **Slovakia (SK)** 🇸🇰 - Mã: +421
- **Estonia (EE)** 🇪🇪 - Mã: +372
- **Latvia (LV)** 🇱🇻 - Mã: +371
- **Lithuania (LT)** 🇱🇹 - Mã: +370
- **Ireland (IE)** 🇮🇪 - Mã: +353
- **Portugal (PT)** 🇵🇹 - Mã: +351
- **Greece (GR)** 🇬🇷 - Mã: +30
- **Cyprus (CY)** 🇨🇾 - Mã: +357
- **Malta (MT)** 🇲🇹 - Mã: +356
- **Luxembourg (LU)** 🇱🇺 - Mã: +352
- **Iceland (IS)** 🇮🇸 - Mã: +354
- **Russia (RU)** 🇷🇺 - Mã: +7
- **Ukraine (UA)** 🇺🇦 - Mã: +380
- **Belarus (BY)** 🇧🇾 - Mã: +375
- **Moldova (MD)** 🇲🇩 - Mã: +373

### Châu Mỹ
- **United States (US)** 🇺🇸 - Mã: +1
- **Canada (CA)** 🇨🇦 - Mã: +1
- **Brazil (BR)** 🇧🇷 - Mã: +55
- **Argentina (AR)** 🇦🇷 - Mã: +54
- **Mexico (MX)** 🇲🇽 - Mã: +52
- **Chile (CL)** 🇨🇱 - Mã: +56
- **Colombia (CO)** 🇨🇴 - Mã: +57
- **Peru (PE)** 🇵🇪 - Mã: +51
- **Venezuela (VE)** 🇻🇪 - Mã: +58
- **Uruguay (UY)** 🇺🇾 - Mã: +598
- **Paraguay (PY)** 🇵🇾 - Mã: +595
- **Bolivia (BO)** 🇧🇴 - Mã: +591
- **Ecuador (EC)** 🇪🇨 - Mã: +593

### Châu Phi
- **South Africa (ZA)** 🇿🇦 - Mã: +27
- **Egypt (EG)** 🇪🇬 - Mã: +20
- **Nigeria (NG)** 🇳🇬 - Mã: +234
- **Kenya (KE)** 🇰🇪 - Mã: +254
- **Ghana (GH)** 🇬🇭 - Mã: +233
- **Uganda (UG)** 🇺🇬 - Mã: +256
- **Tanzania (TZ)** 🇹🇿 - Mã: +255
- **Ethiopia (ET)** 🇪🇹 - Mã: +251
- **Morocco (MA)** 🇲🇦 - Mã: +212
- **Algeria (DZ)** 🇩🇿 - Mã: +213
- **Tunisia (TN)** 🇹🇳 - Mã: +216
- **Libya (LY)** 🇱🇾 - Mã: +218
- **Sudan (SD)** 🇸🇩 - Mã: +249

### Châu Đại Dương
- **Australia (AU)** 🇦🇺 - Mã: +61
- **New Zealand (NZ)** 🇳🇿 - Mã: +64

**Lưu ý**: Một số quốc gia có cùng mã điện thoại (VD: US và Canada đều +1, Kazakhstan và Russia đều +7) nhưng hiển thị cờ khác nhau để phân biệt.

## Hiển thị cờ quốc gia

Component sử dụng **3 phương pháp fallback** để đảm bảo cờ hiển thị trên mọi hệ thống:

1. **Thư viện `country-flag-icons`** (ưu tiên cao nhất)
   - Sử dụng thư viện chuyên dụng cho cờ quốc gia
   - Hỗ trợ tất cả quốc gia ISO

2. **Emoji flags** (fallback thứ 2)
   - Sử dụng emoji flags Unicode
   - Hoạt động tốt trên hầu hết hệ thống hiện đại

3. **CSS flags** (fallback cuối cùng)
   - Tạo cờ bằng CSS thuần túy
   - Đảm bảo hiển thị trên mọi hệ thống

## CSS Classes

Component sử dụng các CSS classes tùy chỉnh:
- `.phone-input-custom-container`: Container chính chứa 2 ô
- `.phone-input-custom-button-wrapper`: Wrapper cho ô chọn quốc gia
- `.phone-input-custom-button`: Nút chọn quốc gia
- `.phone-input-custom-input`: Input số điện thoại
- `.phone-input-custom-dropdown`: Dropdown danh sách quốc gia
- `.country-option`: Option trong dropdown
- `.flag-css`: CSS flags cho fallback

## Ví dụ sử dụng trong form

```tsx
const [phone, setPhone] = useState('');
const [errors, setErrors] = useState({ phone: '' });

// Trong form
<PhoneInput
  label="Contact Number"
  value={phone}
  onChange={(value) => {
    setPhone(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }}
  error={errors.phone}
  required
  placeholder="Enter your contact number"
/>
```

## Lưu ý

- Component tự động xử lý việc tách và ghép mã quốc gia với số điện thoại
- Giá trị `value` sẽ bao gồm mã quốc gia (VD: "+6512345678")
- Khi thay đổi quốc gia, số điện thoại sẽ được giữ nguyên, chỉ thay đổi mã quốc gia
- **Cờ quốc gia hiển thị rõ ràng** với 3 phương pháp fallback đảm bảo tương thích
- **Mã quốc gia hiển thị rõ ràng** trong ô chọn quốc gia, giữa cờ và icon dropdown
- Dropdown có animation và hover effects
- Component hoàn toàn tùy chỉnh, không phụ thuộc vào react-phone-input-2 cho giao diện

## Logic Submit và Validation

### Validation tự động
Component sử dụng utility function `validatePhoneNumber` để kiểm tra format số điện thoại:
- Phải bắt đầu bằng `+` và mã quốc gia
- Tổng cộng 1-15 chữ số (bao gồm mã quốc gia)
- Format chuẩn quốc tế: `+[mã quốc gia][số điện thoại]`

### Logic Submit tối ưu
- **Phone number đã bao gồm mã quốc gia** từ component PhoneInput
- **Không cần thêm `+`** khi submit vì đã có sẵn
- **Validation trước khi submit** để đảm bảo format đúng
- **Error handling** cho các trường hợp lỗi network
- **Logging chi tiết** để debug API calls

### Debug và Monitoring
- **Console logging chi tiết** cho mọi API call
- **Request/Response logging** để debug
- **Error handling** với user notification
- **Validation logging** để track form issues

### API Endpoints được sử dụng
- **ProductDetail & AcquireAnItem**: `POST /api/form-acquire`
- **AppraiseAnItem**: `POST /api/upload` (upload ảnh) + `POST /api/submission` (submit form)

### Ví dụ sử dụng trong form submit
```tsx
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/form-acquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          contactNumber: phone, // +6512345678
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    
    // Handle success...
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};
```