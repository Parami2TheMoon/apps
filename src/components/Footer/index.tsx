import config from '@/config/config';
import { Footer } from 'antd/lib/layout/layout';
import { useIntl, history } from 'umi';

import styles from './index.less';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'common.copyright.produced',
  });

  return (
    <Footer className={styles.footer}>
      <img
        src="/images/logo-text-black.svg"
        style={{
          display: 'block',
          width: 150,
          opacity: 0.3,
          marginBottom: 20,
        }}
        onClick={() => history.push(config.page.walletPage)}
      />
      <span className={styles.slogan}>
        {defaultMessage}
      </span>
    </Footer>
  );
};
