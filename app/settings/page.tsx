import React from "react";
import SettingPageClient from "../components/clients/settings/SettingPageClient";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = () => <SettingPageClient />;

export default SettingPage;
