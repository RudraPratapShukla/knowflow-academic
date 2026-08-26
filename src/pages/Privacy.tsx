import { Header } from "@/components/Header";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container max-w-3xl py-12">
                <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        Last updated: March 1, 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Information We Collect</h2>
                        <p>
                            At KnowFlow, we collect minimal information to provide our academic search services. We may collect your email address if you choose to publish a web blog, and non-personally identifiable search data to improve our credibility scoring algorithms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to operate, maintain, and provide the features and functionality of the Service. We use non-identifying search query data to analyze trends and improve the accuracy of our article and video aggregation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Third-Party Services</h2>
                        <p>
                            Our search engine aggregates content from third-party APIs including YouTube, Crossref, and Dev.to. When you interact with this content, you may be subject to the privacy policies of those respective platforms. We do not sell your personal data to these or any other third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Data Security</h2>
                        <p>
                            We care about the security of your information and employ reasonable physical, administrative, and technological safeguards designed to preserve the integrity and security of all information collected through our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Changes to This Privacy Policy</h2>
                        <p>
                            We may modify or update this Privacy Policy from time to time, so please review it periodically. We may provide you additional forms of notice of modifications or updates as appropriate under the circumstances.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or the Service, please contact us at hastaglord@gmail.com.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
