import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    title: 'Intear Bot',
    description: (
      <>
        Our old and deprecated <Link to="https://t.me/IntearBot">Intear Bot</Link> will
        help you track transactions of specific accounts and notify when you can claim
        HOT.
      </>
    ),
  },
  {
    title: 'Bettear Bot',
    description: (
      <>
        Set up a buybot in your group or DM, check balance and NEAR staking of an account,
        set up NFT trade / mint / burn alerts, alerts when a new token or LP pool is
        created, get price alerts for any token on Near, Near.Social notifications, alerts
        when someone donates to a Potlock project, when any smart contract emits a custom
        event, get a list of token holders, trade, snipe, use trigger orders, copytrade, bridge,
        and much more - possible only with our new <Link to="https://t.me/BettearBot">Bettear Bot</Link>.
        It's <Link to="https://github.com/INTEARnear/Tear">partially open-source</Link>, by the way.
      </>
    ),
  },
  {
    title: 'Events API',
    description: (
      <>
        Check out our <Link to="/docs/events-api">Events API</Link> for getting historical
        HTTP and realtime WebSocket events on NEAR blockchain, with 15+ events available
        on mainnet and testnet.
      </>
    ),
  },
  {
    title: 'DEX Aggregator',
    description: (
      <>
        Access our <Link to="/docs/dex-aggregator">DEX Aggregator</Link> for optimal
        trading routes across multiple decentralized exchanges on NEAR blockchain,
        ensuring best prices and minimal slippage.
      </>
    ),
  },
  {
    title: 'Token Indexer',
    description: (
      <>
        Fetch token prices, metadata, total / circulating supply, reputation, and more:
        Check <Link to="/docs/token-indexer">Token Indexer docs</Link> for more details.
      </>
    ),
  },
  {
    title: 'Oracle',
    description: (
      <>
        A fully decentralized oracle marketplace hosted as a smart contract on NEAR, that
        utilizes yield / resume host functions to provide the best developer experience.
        Check <Link to="/docs/oracle">Oracle docs</Link> for API reference and examples.
      </>
    ),
  },
  {
    title: 'AI Moderator',
    description: (
      <>
        Moderate your Telegram groups easily with our AI Moderator bot. Set up your own
        rules (prompt), punishments, number of messages to check before user becomes trusted.
        Check out our <Link to="https://telegra.ph/AI-Moderator-09-09">guide</Link>!
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={'col col--4'}>
      <div className="text--center padding-horiz--md mt-8">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
