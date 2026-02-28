import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
