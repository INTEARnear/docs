import clsx from 'clsx';
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
    title: 'Xeon Bot',
    description: (
      <>
        Set up a buybot in your group or DM, check balance and NEAR staking of an account,
        set up NFT trade / mint / burn alerts, alerts when a new token or LP pool is
        created, get price alerts for any token on Near, Near.Social notifications, alerts
        when someone donates to a Potlock project, when any smart contract emits a custom
        event, get a list of token holders, and much more - possible only with our
        new <Link to="https://t.me/Intear_Xeon_bot">Xeon Bot</Link>. It's <Link to="https://github.com/INTEARnear/Tear">partially
        open-source</Link>, by the way.
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
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
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
