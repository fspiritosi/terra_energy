import { VerifyEmailClient } from "./verify-email-client";

export default function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { email?: string };
}) {
    return <VerifyEmailClient email={searchParams.email} />;
}