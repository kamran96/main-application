import { Story, Meta } from '@storybook/react';
import { SidebarUi } from './sidebar-ui';

export default {
  component: SidebarUi,
  title: 'SidebarUi',
} as Meta;

const Template: Story<> = (args) => <SidebarUi {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
