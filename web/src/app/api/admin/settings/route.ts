import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { ensureSiteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return withAdmin(async () => {
    const config = await ensureSiteConfig();
    return { config };
  });
}

export async function PUT(request: Request) {
  return withAdmin(async () => {
    await ensureSiteConfig();
    const body = await request.json();
    const config = await prisma.siteConfig.update({
      where: { id: "default" },
      data: {
        logoUrl: body.logoUrl != null ? String(body.logoUrl) : undefined,
        siteTitle: body.siteTitle != null ? String(body.siteTitle) : undefined,
        themeAccent:
          body.themeAccent != null ? String(body.themeAccent) : undefined,
        policyRefundZh:
          body.policyRefundZh != null ? String(body.policyRefundZh) : undefined,
        policyRefundEn:
          body.policyRefundEn != null ? String(body.policyRefundEn) : undefined,
        policyRefundMs:
          body.policyRefundMs != null ? String(body.policyRefundMs) : undefined,
        policyShippingZh:
          body.policyShippingZh != null
            ? String(body.policyShippingZh)
            : undefined,
        policyShippingEn:
          body.policyShippingEn != null
            ? String(body.policyShippingEn)
            : undefined,
        policyShippingMs:
          body.policyShippingMs != null
            ? String(body.policyShippingMs)
            : undefined,
        policyTermsZh:
          body.policyTermsZh != null ? String(body.policyTermsZh) : undefined,
        policyTermsEn:
          body.policyTermsEn != null ? String(body.policyTermsEn) : undefined,
        policyTermsMs:
          body.policyTermsMs != null ? String(body.policyTermsMs) : undefined,
        policyCareZh:
          body.policyCareZh != null ? String(body.policyCareZh) : undefined,
        policyCareEn:
          body.policyCareEn != null ? String(body.policyCareEn) : undefined,
        policyCareMs:
          body.policyCareMs != null ? String(body.policyCareMs) : undefined,
        photoGuideTitleZh:
          body.photoGuideTitleZh != null
            ? String(body.photoGuideTitleZh)
            : undefined,
        photoGuideTitleEn:
          body.photoGuideTitleEn != null
            ? String(body.photoGuideTitleEn)
            : undefined,
        photoGuideTitleMs:
          body.photoGuideTitleMs != null
            ? String(body.photoGuideTitleMs)
            : undefined,
        photoGuideIntroZh:
          body.photoGuideIntroZh != null
            ? String(body.photoGuideIntroZh)
            : undefined,
        photoGuideIntroEn:
          body.photoGuideIntroEn != null
            ? String(body.photoGuideIntroEn)
            : undefined,
        photoGuideIntroMs:
          body.photoGuideIntroMs != null
            ? String(body.photoGuideIntroMs)
            : undefined,
        photoGuideTipsJson:
          body.photoGuideTips != null
            ? JSON.stringify(body.photoGuideTips)
            : undefined,
        processTitleZh:
          body.processTitleZh != null ? String(body.processTitleZh) : undefined,
        processTitleEn:
          body.processTitleEn != null ? String(body.processTitleEn) : undefined,
        processTitleMs:
          body.processTitleMs != null ? String(body.processTitleMs) : undefined,
        processBodyZh:
          body.processBodyZh != null ? String(body.processBodyZh) : undefined,
        processBodyEn:
          body.processBodyEn != null ? String(body.processBodyEn) : undefined,
        processBodyMs:
          body.processBodyMs != null ? String(body.processBodyMs) : undefined,
        processStepsJson:
          body.processSteps != null
            ? JSON.stringify(body.processSteps)
            : undefined,
        faqJson: body.faq != null ? JSON.stringify(body.faq) : undefined,
        socialJson:
          body.social != null ? JSON.stringify(body.social) : undefined,
        thanksJson:
          body.thanks != null ? JSON.stringify(body.thanks) : undefined,
        regionsJson:
          body.regions != null ? JSON.stringify(body.regions) : undefined,
      },
    });
    return { config };
  });
}
