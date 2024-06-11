package metakeep

import "github.com/spf13/viper"

type MetaKeepConfig struct {
	BjjAppApiKey    string `tip:"MetaKeep BJJ app API key"`
	BjjAppApiSecret string `tip:"MetaKeep BJJ app API secret"`
}

// Loads config in the DEV environment
// DO NOT USE this in PROD environment. For production, fetch
// MetaKeep specific configuration from secret management system e.g.
// AWS Secret Manager, GCP Secret Manager or use AWS KMS or similar system
// to create MetaKeep API key and secret.
// Please consult with the MetaKeep team for the best practices.
func LoadMetaKeepConfigDev() *MetaKeepConfig {
	viper.SetEnvPrefix("METAKEEP")

	_ = viper.BindEnv("BjjAppApiKey", "METAKEEP_BJJ_APP_API_KEY")
	_ = viper.BindEnv("BjjAppApiSecret", "METAKEEP_BJJ_APP_API_SECRET")

	viper.AutomaticEnv()

	// Load config
	cfg := &MetaKeepConfig{}

	if err := viper.Unmarshal(cfg); err != nil {
		panic(err)
	}

	if cfg.BjjAppApiKey == "" {
		panic("MetaKeep BJJ app API key is empty")
	}

	if cfg.BjjAppApiSecret == "" {
		panic("MetaKeep BJJ app API secret is empty")
	}

	return cfg
}
