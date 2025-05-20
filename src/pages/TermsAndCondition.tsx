import React from 'react';
import termsConditionImg from '../assets/terms_condition.png';
import termsConditionMobileImg from '../assets/terms_condition_mobile.png';

export default function TermsAndCondition() {
  return (
    <div className="bg-[#F7F5EA] min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[220px] md:h-[320px] flex items-center justify-center overflow-hidden">
        <img
          src={termsConditionMobileImg}
          alt="Terms and Conditions Mobile"
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
          style={{maxWidth: '100vw'}}
        />
        <img
          src={termsConditionImg}
          alt="Terms and Conditions"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
          style={{maxWidth: '100vw'}}
        />
      </div>

      {/* Content Section */}
      <div className="max-w-2xl mx-auto px-4 md:px-0 py-10 text-[#2E2A24] text-base" style={{fontFamily: 'PingFang SC, Helvetica Neue, Arial, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, STHeiti, SimSun, sans-serif'}}>
        <p className="mb-4">
          The following are the terms and conditions (the "Terms"/"under" which you (a "User") may use the web site known as brand web site of Kangxi's Finder Collection (the "Company") and which composition and order also address disclaimers of liability and other legal terms relating to the Web Site ("Site"). Please read the following carefully. By accessing and using the Web Site, you accept and agree to be bound, without modification, limitation or qualification, by the Terms. The Company may, at its sole discretion, modify or revise these Terms at any time by updating the text of this page. You are bound by any such modification or revision and should therefore visit this page periodically to review the Terms.
        </p>
        <p className="mb-4">
          Specific terms and conditions may apply to transactions conducted on, or in connection with, the Web Site, and other terms may be processed elsewhere in the Web Site, and such other terms are deemed produced as if in connection with the Web Site, and you agree to be bound by such terms.
        </p>
        <div className="bg-[#E6DDC6] border border-[#C7C7B9] rounded p-4 mb-6 text-[#61422D] text-sm">
          <strong>YOUR USE OF THE WEB SITE CONSTITUTES YOUR AGREEMENT TO ALL TERMS, CONDITIONS, AND NOTICES CONTAINED HEREIN OR OTHERWISE POSTED ON THE WEB SITE. THE CONTENT OF SUCH AGREEMENT, INCLUDING, OF THE TERMS AND ALL SUCH ADDITIONAL CONDITIONS AND NOTICES, ARE TOGETHER REFERRED TO HEREIN AS THE "AGREEMENT." IF YOU DO NOT ACCEPT ANY OF THE PROVISIONS OF THE AGREEMENT, DO NOT USE THE WEB SITE.</strong>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Section 1. The Material on the Web Site</h2>
        <p className="mb-4"><strong>WARNING:</strong> The content of the Web Site is not intended for minors. Some content could be viewed as explicit or of an adult nature, including, but not limited to, images, sounds and words. All original works, texts, graphics, interfaces, code, and the selection and arrangement thereof on the Web Site are the property of the Company, and all rights in and to the Web Site, including all intellectual property rights, are reserved. Neither the said author, or any entity or person related with the Web Site shall be construed as warranting, nor endorsing that any of the Company's or any third party's intellectual property rights, either under the laws or expressly provided in the transaction or terms of the agreement, whether by limitation, exception or otherwise.</p>
        <p className="mb-4">Unauthorized use of the Material also violates copyright, trademark, and other laws. You may not sell, assign, distribute, reproduce, upload, post, transmit, or modify the Material or otherwise use any portion of the Material in any way for any public or commercial purpose, except as expressly permitted in writing by the Company. The use of the Material on any other web site or in a networked computer environment for any purpose is prohibited. Collection or compilation of material on the Web Site without the express written permission of the Company is strictly prohibited. With respect to any web page you "link" to the Web Site, the Company reserves the right to require that such link be removed at any time, in its sole discretion.</p>
        <p className="mb-4">Some of the content and other proprietary notices contained in or on the Material, may differ from those contained in these Terms. You must abide by all additional restrictions displayed on the Web Site as it may be updated from time to time. The Company may, at any time, revise or modify these Terms or impose new conditions for use of the Web Site. Such changes, revisions or modifications shall be effective immediately upon notice thereof, which may be given by any means including, but not limited to, posting on the Web Site. Any use of the Web Site by you after such notice shall be deemed to constitute acceptance of such changes, revisions or modifications. The Company may modify, suspend, discontinue or restrict the use of any portion of the Web Site, including the availability of any portion of the content at any time, without notice or liability.</p>
        <p className="mb-4">If you believe that your work has been copied in a way that constitutes copyright infringement, please provide the Company with the following information: a description of the copyrighted work that you claim has been infringed; a description of where the Material that you claim is infringing is located on the site; your address, telephone number, and e-mail address; a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; a statement, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</p>
        <p className="mb-4">Notice of claims of copyright infringement should be directed to: <a href="mailto:info@kangxifinders.com" className="underline text-[#61422D]">info@kangxifinders.com</a></p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Section 2. Privacy; User Submissions</h2>
        <p className="mb-4">The Company is committed to maintaining your privacy. The Company does, however, gather certain information that you provide to the Web Site for information regarding the Company's policies for such information, please read our Privacy Policy.</p>
        <p className="mb-4">The Company may receive certain areas of the Web Site handle e-mail errors, comments, images, or other submitted (registered) content as "Public Areas". Accordingly, unless expressly stated otherwise, any communications you transmit to the Web Site by electronic mail or otherwise, including any data, questions, comments, suggestions, or the like, will be treated as non-confidential and non-proprietary. Anything you transmit or post may be used by the Company or its affiliates for any purpose, including, but not limited to, reproduction, disclosure, transmission, publication, broadcast, and posting. Furthermore, the Company is free to use any ideas, concepts, know-how, or techniques contained in any communication you send to the Web Site for any purpose whatsoever, including, but not limited to, developing, manufacturing, and marketing products using such information.</p>
        <div className="bg-[#E6DDC6] border border-[#C7C7B9] rounded p-4 mb-6 text-[#61422D] text-sm">
          <strong>THE COMPANY DOES NOT ENDORSE, SUPPORT, REPRESENT OR GUARANTEE THE TRUTHFULNESS, ACCURACY, OR RELIABILITY OF ANY COMMUNICATIONS POSTED BY OTHER USERS OR ENDORSE ANY OPINIONS EXPRESSED BY USERS. YOU ACKNOWLEDGE THAT ANY RELIANCE ON MATERIAL POSTED BY OTHER USERS WILL BE AT YOUR OWN RISK.</strong>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Section 3. Registration, Passwords and Signatures</h2>
        <p className="mb-4">In consideration of your use of the Web Site, you agree to: (a) provide true, accurate, current and complete information about yourself as prompted by the registration form and (b) maintain and promptly update such information to keep it true, accurate, current and complete. If you provide any information that is untrue, inaccurate, not current or incomplete, or the Company has reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, the Company has the right to suspend or terminate your account and refuse any and all current or future use of the Web Site or any portion thereof.</p>
        <p className="mb-4">You are responsible for maintaining the confidentiality of your password and signature (if applicable), and are fully responsible for all activities that occur under your password or signature. You agree to (a) immediately notify the Company of any unauthorized use of your password or signature or any other breach of security, and (b) ensure that you exit from your account at the end of each session. The Company cannot and will not be liable for any loss or damage arising from your failure to comply with this Section.</p>
        <p className="mb-4">The Company does not permit children under the age of 15 to register on the Web Site or use any of its functionality for which registration is required. If you are under 15 years of age, do not attempt to register for any services on the Web Site or provide any personal information about yourself to the Company. If the Company discovers that a child under the age of 15 has provided the Company with personal information, the Company will delete such information from our databases.</p>
      </div>
    </div>
  );
} 