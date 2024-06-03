'use client';

import { DocumentIcon } from '@heroicons/react/24/outline';
import { Tab, Tabs } from '@nextui-org/react';
import FrameViewer from '../frame-viewer';

export default function TabFiles({
  pdf,
  xml,
}: {
  pdf: string | undefined;
  xml: string | undefined;
}) {
  return (
    <div className="flex w-full flex-col">
      <Tabs fullWidth>
        <Tab
          key="pdf-file"
          title={
            <div className="flex items-center">
              <DocumentIcon className="ml-2 w-5" />
              <span>PDF</span>
            </div>
          }
        >
          {pdf ? <FrameViewer src={pdf} type="pdf" /> : 'No hay archivo PDF'}
        </Tab>
        <Tab
          key="xml-file"
          title={
            <div className="flex items-center">
              <DocumentIcon className="ml-2 w-5" />
              <span>XML</span>
            </div>
          }
        >
          {xml ? <FrameViewer src={xml} type="xml" /> : 'No hay archivo XML'}
        </Tab>
      </Tabs>
    </div>
  );
}
