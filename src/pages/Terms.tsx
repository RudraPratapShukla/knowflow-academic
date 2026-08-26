import { Header } from "@/components/Header";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container max-w-3xl py-12">
                <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Last updated: March 1, 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using KnowFlow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Description of Service</h2>
                        <p>
                            KnowFlow is an academic search engine and aggregator that fetches, ranks, and displays educational content including videos, articles, and technical blogs from various third-party public APIs and platforms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. User Content</h2>
                        <p>
                            Users may submit original content via the "Add Blog" feature. By submitting content, you grant KnowFlow a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display the content in connection with the Service. You are solely responsible for ensuring your content does not violate any third-party rights or applicable laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Intellectual Property</h2>
                        <p>
                            The KnowFlow platform, including its original content (excluding user-submitted blogs), features, credibility algorithms, and functionality, are owned by KnowFlow and are protected by international copyright, trademark, and other intellectual property laws. Content aggregated from third parties remains the property of its respective owners.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided "as is" and "as available" without any warranties of any kind. While our algorithms attempt to identify credible sources, we do not guarantee the accuracy, completeness, or usefulness of any aggregated information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Limitation of Liability</h2>
                        <p>
                            In no event shall KnowFlow be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or goodwill, arising from your use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Contact Information</h2>
                        <p>
                            If you have any questions or concerns regarding these Terms, please contact us at hastaglord@gmail.com.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
