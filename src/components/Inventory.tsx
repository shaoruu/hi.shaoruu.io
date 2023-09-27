import { useEffect, useRef, useState } from 'react';

import { ItemSlots } from '@voxelize/core';
import classNames from 'classnames';

import { useVoxelize } from '../hooks/useVoxelize';

export function Inventory() {
  const wrapperDomRef = useRef<HTMLDivElement>(null);

  const { itemSlots, world, inputs, voxelInteract, rigidControls } =
    useVoxelize();
  const [itemSlotIds, setItemSlotIds] = useState([
    1, 2, 50, 51, 52, 53, 54, 55, 56, 57,
  ]);

  const inventorySlotsRef = useRef<ItemSlots>(null);
  const [shouldShowInventory, setShouldShowInventory] = useState(false);

  useEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    const unbind = inputs.bind(
      'e',
      () => {
        setShouldShowInventory((prev) => !prev);
        rigidControls.unlock();
        rigidControls.resetMovements();
      },
      'in-game',
    );

    return () => {
      unbind();
    };
  }, [inputs, rigidControls]);

  useEffect(() => {
    if (!shouldShowInventory || !rigidControls) {
      return;
    }

    const handleCloseInventory = (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        setShouldShowInventory(false);
        rigidControls.lock();
      }
    };

    const preventEscapeDefault = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', preventEscapeDefault);
    document.addEventListener('keyup', handleCloseInventory);

    return () => {
      document.removeEventListener('keydown', preventEscapeDefault);
      document.removeEventListener('keyup', handleCloseInventory);
    };
  }, [rigidControls, shouldShowInventory]);

  useEffect(() => {
    if (
      inventorySlotsRef.current ||
      !world ||
      !itemSlots ||
      !inputs ||
      !wrapperDomRef.current
    ) {
      return;
    }

    const blocks = Array.from(world.registry.blocksByName);
    const colCount = itemSlots.options.horizontalCount;
    const rowCount = Math.ceil(blocks.length / colCount);

    const inventorySlots = new ItemSlots({
      verticalCount: rowCount,
      horizontalCount: colCount,
      slotMargin: 0,
      wrapperStyles: {
        position: 'relative',
        margin: '0px',
      },
      slotStyles: {
        border: '1px solid var(--color-gray-background-light)',
        transition: 'none',
      },
      scrollable: false,
    });

    // @ts-ignore
    inventorySlotsRef.current = inventorySlots;

    inventorySlots.connect(inputs);

    const inventorySlotsDom = inventorySlots.element;
    wrapperDomRef.current.appendChild(inventorySlotsDom);

    const sortedBlocks = [...blocks].sort((a, b) => a[1].id - b[1].id);

    for (let i = 0; i < sortedBlocks.length; i++) {
      const id = sortedBlocks[i][1].id;
      const mesh = world.makeBlockMesh(id, { material: 'standard' });
      const slot = inventorySlots.getSlot(
        Math.floor(i / colCount),
        i % colCount,
      );
      slot.setObject(mesh);
      slot.setContent(id);
    }
  }, [inventorySlotsRef, world, itemSlots, inputs]);

  useEffect(() => {
    if (!inventorySlotsRef.current || !itemSlots) {
      return;
    }

    inventorySlotsRef.current.onSlotClick = (slot) => {
      if (!slot.content) return;
      setItemSlotIds((prev) => {
        const newIds = [...prev];
        newIds[itemSlots.focusedCol] = slot.content;
        return newIds;
      });
    };
  }, [inventorySlotsRef, itemSlots, setItemSlotIds]);

  useEffect(() => {
    if (!inputs || !world || !voxelInteract || !itemSlots || !rigidControls) {
      return;
    }

    const unbind1 = inputs.click(
      'right',
      () => {
        if (!voxelInteract.potential) return;
        const {
          rotation,
          yRotation,
          voxel: [vx, vy, vz],
        } = voxelInteract.potential;

        const slot = itemSlots.getFocused();
        const id = slot.content;
        if (!id) return;

        const { aabbs } = world.getBlockById(id);
        if (
          aabbs.find((aabb) =>
            aabb
              .clone()
              .translate([vx, vy, vz])
              .intersects(rigidControls.body.aabb),
          )
        )
          return;

        world.updateVoxel(vx, vy, vz, id, rotation, yRotation);
      },
      'in-game',
    );

    const unbind2 = inputs.click(
      'middle',
      () => {
        if (!voxelInteract.target) return;
        const [vx, vy, vz] = voxelInteract.target;
        const block = world.getBlockAt(vx, vy, vz);
        if (!block) return;
        const id = block.id;
        const { focusedCol } = itemSlots;
        setItemSlotIds((prev) => {
          const newIds = [...prev];
          newIds[focusedCol] = id;
          return newIds;
        });
      },
      'in-game',
    );

    return () => {
      unbind1();
      unbind2();
    };
  }, [inputs, itemSlots, voxelInteract, world, itemSlotIds, rigidControls]);

  useEffect(() => {
    if (!world || !itemSlots) {
      return;
    }

    itemSlotIds.forEach((id, index) => {
      const mesh = world.makeBlockMesh(id, { material: 'standard' });
      const slot = itemSlots.getSlot(0, index);
      slot.setObject(mesh);
      slot.setContent(id);
    });
  }, [itemSlotIds, itemSlots, world]);

  return (
    <>
      <div
        className={classNames(
          'fixed bottom-0 left-0 w-full h-full bg-black opacity-50',
          { hidden: !shouldShowInventory },
        )}
      />
      <div
        className={classNames(
          'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[40vh] overflow-auto bg-overlay rounded fixed cursor-pointer gap-1 align-middle text-sm no-scrollbar p-2',
          { hidden: !shouldShowInventory },
        )}
        ref={wrapperDomRef}
      ></div>
    </>
  );
}
